import 'dotenv/config'
import mongoose from 'mongoose';
import dbConnect from './db';
import PatientModel from './models/patient.model';
import HospitalModel from './models/hospital.model';
import DoctorModel from './models/doctor.model';
import InvoiceModel from './models/invoice.model';
import AppointmentModel from './models/appointment.model';
import UserModel from './models/user.model';
import { mockPatients, mockHospitals, mockDoctors, mockInvoices, mockAppointments, mockUsers } from './mock-data';

async function seedDatabase() {
    console.log('Starting database seed...');
    try {
        await dbConnect();
        console.log('Database connected.');

        console.log('Clearing existing data...');
        await PatientModel.deleteMany({});
        await HospitalModel.deleteMany({});
        await DoctorModel.deleteMany({});
        await InvoiceModel.deleteMany({});
        await AppointmentModel.deleteMany({});
        await UserModel.deleteMany({});
        console.log('Existing data cleared.');

        console.log('Inserting mock data...');
        
        const hospitals = await HospitalModel.insertMany(mockHospitals);
        console.log(`${hospitals.length} hospitals inserted.`);
        const hospitalMap = new Map(hospitals.map(h => [h.name, h._id.toString()]));

        const doctors = await DoctorModel.insertMany(mockDoctors.map(d => ({
            ...d,
            hospital: d.hospital // Keep as name for lookup
        })));
        console.log(`${doctors.length} doctors inserted.`);
        const doctorMap = new Map(doctors.map(d => [d.name, d._id.toString()]));

        const patients = await PatientModel.insertMany(mockPatients.map(p => ({
            ...p,
        })));
        console.log(`${patients.length} patients inserted.`);
        const patientMap = new Map(patients.map(p => [p.patientId, p._id.toString()]));

        await InvoiceModel.insertMany(mockInvoices.map(i => {
            const pId = patientMap.get(i.patientId);
            if (!pId) {
                console.warn(`Could not find patient with ID: ${i.patientId} for invoice.`);
                return null;
            }
            return {
                ...i,
                patientId: pId
            }
        }).filter(Boolean));
        console.log(`${mockInvoices.length} invoices prepared to be inserted.`);
        
        await AppointmentModel.insertMany(mockAppointments.map(a => {
            const patientId = patientMap.get(a.patientId);
            const doctorId = doctorMap.get(a.doctorName);
            const hospitalId = hospitalMap.get(a.hospitalName);

            if (!patientId || !doctorId || !hospitalId) {
                 console.warn(`Skipping appointment for ${a.patientName} due to missing references.`);
                 return null;
            }
            return {
                ...a,
                patientId,
                doctorId,
                hospitalId,
            }
        }).filter(Boolean));
        console.log(`${mockAppointments.length} appointments prepared to be inserted.`);
        
        // In a real app, hash passwords before inserting
        await UserModel.insertMany(mockUsers.map(u => ({...u, password: 'password'})));
        console.log(`${mockUsers.length} users inserted.`);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

seedDatabase();
