const asyncHandler = require("express-async-handler");
const { getAllContacts, createContact, updateContact, deleteContact } = require("../services/contact.service");

const getContacts = asyncHandler(async (req, res) => {
  const userId = req.userData.id;
  const contacts = await getAllContacts(userId);

  return res.status(200).json(contacts);
});

const createContactController = asyncHandler(async (req, res) => {
  const userId = req.userData.id;
  const contact = await createContact({ ...req.body, userId });

  return res.status(201).json(contact);
});

const updateContactController = asyncHandler(async (req, res) => {
  const userId = req.userData.id;
  const contact = await updateContact(req.params.id, { ...req.body, userId });

  return res.status(200).json(contact);
});

const deleteContactController = asyncHandler(async (req, res) => {
  await deleteContact(req.params.id);

  return res.status(204).send();
});

module.exports = { getContacts, createContactController, updateContactController, deleteContactController };