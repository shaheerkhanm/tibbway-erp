
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
        const hospitalMap = new Map(hospitals.map(h => [h.name, h._id]));

        const doctors = await DoctorModel.insertMany(mockDoctors.map(d => ({
            ...d,
            hospital: hospitalMap.get(d.hospital)
        })));
        console.log(`${doctors.length} doctors inserted.`);
        const doctorMap = new Map(doctors.map(d => [d.name, d._id]));

        const patients = await PatientModel.insertMany(mockPatients.map(p => ({
            ...p,
            assignedHospital: hospitalMap.get(p.assignedHospital),
            assignedDoctor: doctorMap.get(p.assignedDoctor),
        })));
        console.log(`${patients.length} patients inserted.`);
        const patientMap = new Map(patients.map(p => [p.patientId, p._id]));

        await InvoiceModel.insertMany(mockInvoices.map(i => ({
            ...i,
            patientId: patientMap.get(i.patientId)
        })));
        console.log(`${mockInvoices.length} invoices inserted.`);
        
        await AppointmentModel.insertMany(mockAppointments.map(a => ({
            ...a,
            patientId: patientMap.get(a.patientId),
            doctorId: doctorMap.get(a.doctorName),
            hospitalId: hospitalMap.get(a.hospitalName),
        })));
        console.log(`${mockAppointments.length} appointments inserted.`);
        
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
