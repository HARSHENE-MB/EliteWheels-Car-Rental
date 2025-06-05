package com.elitewheels.dto;

import org.springframework.web.multipart.MultipartFile;

public class Customer {

    private String firstName;
    private String middleName;
    private String lastName;
    private String dob;
    private String gender;
    private String nationality;
    private String occupation;
    private String email;
    private String phone;
    private String address;
    private String state;
    private String pincode;
    private String drivingLicenseNumber;
    private boolean termsAndConditions;
    private boolean dataHandlingConsent;
    private MultipartFile profilePhoto;
    private String idProofType;
    private MultipartFile idProof;

    // No-argument constructor
    public Customer() {
    }

    // All-argument constructor
    public Customer(String firstName, String middleName, String lastName, String dob, String gender, String nationality,
                    String occupation, String email, String phone, String address, String state, String pincode,
                    String drivingLicenseNumber, boolean termsAndConditions, boolean dataHandlingConsent,
                    MultipartFile profilePhoto, String idProofType, MultipartFile idProof) {
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.dob = dob;
        this.gender = gender;
        this.nationality = nationality;
        this.occupation = occupation;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.state = state;
        this.pincode = pincode;
        this.drivingLicenseNumber = drivingLicenseNumber;
        this.termsAndConditions = termsAndConditions;
        this.dataHandlingConsent = dataHandlingConsent;
        this.profilePhoto = profilePhoto;
        this.idProofType = idProofType;
        this.idProof = idProof;
    }

    // Getters and setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getDrivingLicenseNumber() {
        return drivingLicenseNumber;
    }

    public void setDrivingLicenseNumber(String drivingLicenseNumber) {
        this.drivingLicenseNumber = drivingLicenseNumber;
    }

    public boolean isTermsAndConditions() {
        return termsAndConditions;
    }

    public void setTermsAndConditions(boolean termsAndConditions) {
        this.termsAndConditions = termsAndConditions;
    }

    public boolean isDataHandlingConsent() {
        return dataHandlingConsent;
    }

    public void setDataHandlingConsent(boolean dataHandlingConsent) {
        this.dataHandlingConsent = dataHandlingConsent;
    }

    public MultipartFile getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(MultipartFile profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getIdProofType() {
        return idProofType;
    }

    public void setIdProofType(String idProofType) {
        this.idProofType = idProofType;
    }

    public MultipartFile getIdProof() {
        return idProof;
    }

    public void setIdProof(MultipartFile idProof) {
        this.idProof = idProof;
    }
}
