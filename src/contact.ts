import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export type ContactProps = {
    id: string;
    first?: string;
    last?: string;
    favorite?: string;
    avatar ?: string;
    notes?: string;
    twitter?: string;
};

export type IContacts = ContactProps[] | null;

export async function getContacts(query?: string | null) {
    await fakeNetwork(`getContacts:${query}`);
    let contacts: IContacts = await localforage.getItem("contacts") ?? [];
    if (query) {
        contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
    }
    return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
    await fakeNetwork(null);
    let id = Math.random().toString(36).substring(2, 9);
    let contact = { id, createdAt: Date.now() };
    let contacts = await getContacts(null);
    contacts.unshift(contact);
    await set(contacts);
    return contact;
}

export async function getContact(id: string) {
    await fakeNetwork(`contact:${id}`);
    let contacts: IContacts = await localforage.getItem("contacts") ?? [];
    let contact = contacts ? contacts.find((contact) => contact.id === id) : null;
    return contact;
}

export async function updateContact(id, updates) {
    await fakeNetwork(null);
    let contacts: IContacts = await localforage.getItem("contacts") ?? [];
    let contact = contacts.find((contact) => contact.id === id);
    if (!contact) throw new Error("No contact found for" + " id");
    Object.assign(contact, updates);
    await set(contacts);
    return contact;
}

export async function deleteContact(id) {
    let contacts : IContacts = await localforage.getItem("contacts") ?? [];
    let index = contacts.findIndex((contact) => contact.id === id);
    if (index > -1) {
        contacts.splice(index, 1);
        await set(contacts);
        return true;
    }
    return false;
}

function set(contacts) {
    return localforage.setItem("contacts", contacts);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key: any) {
    if (key == null) {
        fakeCache = {};
    }

    if (fakeCache[key]) {
        return;
    }

    fakeCache[key] = true;
    return new Promise((res) => {
        setTimeout(res, Math.random() * 800);
    });
}
