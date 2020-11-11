export default (contacts, text="") => {
    return contacts.filter((contact) => contact.username.toLowerCase().includes(text.toLowerCase()));
}