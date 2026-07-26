MedChain – Secure Medical Record Management System

MedChain is a simple web-based medical record management system built as a college capstone project for Blockchain and Cryptography.

The main idea is to protect medical records using basic cryptography techniques and maintain a tamper-evident record of important activities using a simple blockchain.

What the Project Does

The system provides separate access for doctors and patients.

A doctor can upload a patient's medical PDF, while a patient can view and securely download their records.

Before a medical file is stored, the system:

Generates a SHA-256 hash of the file.
Encrypts the file using AES-256.
Stores the encrypted file and its details in MongoDB.
Creates a blockchain block containing the file hash and previous block hash.

When a patient downloads a record, the system verifies its integrity by generating the hash again and comparing it with the original hash.

Main Features
Doctor and patient registration
Secure login using JWT
Password hashing with bcrypt
Medical PDF upload
AES-256 file encryption
SHA-256 hash generation
Medical record integrity verification
Blockchain-based audit trail
Secure medical record download
Simple blockchain ledger view
