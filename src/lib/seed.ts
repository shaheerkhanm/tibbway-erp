
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
        await PatientModel.insertMany(mockPatients);
        console.log(`${mockPatients.length} patients inserted.`);
        
        await HospitalModel.insertMany(mockHospitals);
        console.log(`${mockHospitals.length} hospitals inserted.`);
        
        await DoctorModel.insertMany(mockDoctors);
        console.log(`${mockDoctors.length} doctors inserted.`);
        
        await InvoiceModel.insertMany(mockInvoices);
        console.log(`${mockInvoices.length} invoices inserted.`);
        
        await AppointmentModel.insertMany(mockAppointments);
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
