const fs = require('fs').promises
const path = require('path')
const {nanoid} = require('nanoid');

const contactsPath = path.join(__dirname, "db", "contacts.json")

async function listContacts() {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const contacts = await listContacts();
    const stringId = stringifyId(contactId)
    const result = contacts.find(item => item.id === stringId);
    return result || null;
}

async function removeContact(contactId) {
    const contacts = await listContacts();
    const stringId = stringifyId(contactId)
    const index = contacts.findIndex(item => item.id === stringId);
    if(index === -1){
        return null;
    }
    const [result] = contacts.splice(index, 1);
    await updateContacts(contacts)
    return result;

}

async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone,
    }

    contacts.push(newContact)
    await updateContacts(contacts)
    return contacts

}

async function updateContacts(contacts) {
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
}

function stringifyId(id) {
    return id.toString()
}


module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
};