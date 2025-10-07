const Contact = require("../models/Contacts");

getAllContacts = async (userId) => {
  const contacts = await Contact.find({ userId });

  if (!contacts) {
    throw new Error("No contacts found");
  }
  
  return contacts;
};

createContact = async (contactData) => {
  const contact = await Contact.create(contactData);
  return contact;
};

updateContact = async (contactId, contactData) => {
  // First check if contact exists and belongs to user
  const existingContact = await Contact.findOne({ _id: contactId, userId: contactData.userId });
  
  if (!existingContact) {
    const error = new Error("Contact not found");
    error.statusCode = 404;
    throw error;
  }
  
  const contact = await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
  return contact;
}

deleteContact = async (contactId, userId) => {
  // First check if contact exists and belongs to user
  const contact = await Contact.findOne({ _id: contactId, userId });
  
  if (!contact) {
    const error = new Error("Contact not found");
    error.statusCode = 404;
    throw error;
  }
  
  await Contact.findByIdAndDelete(contactId);
  return contact;
}

module.exports = { getAllContacts, createContact, updateContact, deleteContact };