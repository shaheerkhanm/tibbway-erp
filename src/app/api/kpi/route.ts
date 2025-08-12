import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import PatientModel from "@/lib/models/patient.model";
import InvoiceModel from "@/lib/models/invoice.model";
import { startOfMonth, endOfMonth } from 'date-fns';

async function getMonthlyPatients() {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const count = await PatientModel.countDocuments({
        treatmentDate: {
            $gte: start.toISOString().split('T')[0],
            $lte: end.toISOString().split('T')[0],
        }
    });
    return count;
}

async function getMonthlyRevenue() {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const result = await InvoiceModel.aggregate([
        {
            $match: {
                issuedDate: {
                    $gte: start.toISOString().split('T')[0],
                    $lte: end.toISOString().split('T')[0],
                },
                status: 'Paid'
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);
    return result.length > 0 ? result[0].total : 0;
}

async function getTopCountries() {
    const result = await PatientModel.aggregate([
        {
            $group: {
                _id: '$country',
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $project: {
                _id: 0,
                name: '$_id',
                value: '$count'
            }
        }
    ]);
    return result;
}

async function getRevenueByMonth() {
    const year = new Date().getFullYear();
    const result = await InvoiceModel.aggregate([
        {
            $match: {
                issuedDate: { $regex: `^${year}` },
                status: 'Paid'
            }
        },
        {
            $group: {
                _id: { $substr: ['$issuedDate', 5, 2] }, // group by month
                total: { $sum: '$amount' }
            }
        },
        { $sort: { '_id': 1 } }
    ]);
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = monthNames.map((month, index) => {
        const monthStr = (index + 1).toString().padStart(2, '0');
        const monthData = result.find(r => r._id === monthStr);
        return {
            month,
            revenue: monthData ? monthData.total : 0
        };
    });

    return revenueData;
}


export async function GET() {
  try {
    await dbConnect();
    
    const [monthlyPatients, monthlyRevenue, topCountries, revenueByMonth] = await Promise.all([
        getMonthlyPatients(),
        getMonthlyRevenue(),
        getTopCountries(),
        getRevenueByMonth()
    ]);

    const kpiData = {
        monthlyPatients,
        monthlyRevenue,
        topCountries,
        revenueByMonth
    };

    return NextResponse.json(kpiData);
  } catch (error) {
    console.error("Failed to fetch KPI data", error);
    return NextResponse.json({ error: "Failed to fetch KPI data" }, { status: 500 });
  }
}
