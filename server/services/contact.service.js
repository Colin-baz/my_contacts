const Contact = require("../models/Contacts");

getAllContacts = async (userId) => {
  const contacts = await Contact.find({ userId });

  if (!contacts) {
    throw new Error("No contacts found");
  }
  
  return contacts;
};

createContact = async (contactData) => {
  await Contact.create(contactData);
};

updateContact = async (contactId, contactData) => {
  await Contact.findByIdAndUpdate(contactId, contactData, { new: true });
}

deleteContact = async (contactId) => {
  await Contact.findByIdAndDelete(contactId);
}

module.exports = { getAllContacts, createContact, updateContact, deleteContact };