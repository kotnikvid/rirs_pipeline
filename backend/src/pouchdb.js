const PouchDB = require("pouchdb");
const db = new PouchDB("my_database");

// Add a document
async function addDocument(doc) {
  return await db.post(doc);
}

// Add a document
async function addDocumentsList(doc) {
  return await db.bulkDocs(doc);
}

// Get all documents
async function getAllDocuments() {
  return await db.allDocs({ include_docs: true });
}

// Delete document
async function deleteDocument(id, rev) {
  return await db.remove(id, rev);
}

// Delete a document with only `_id` by first fetching `_rev`
async function deleteDocumentById(id) {
  try {
    // Fetch the document to get the `_rev`
    const doc = await db.get(id);
    const response = await db.remove(doc._id, doc._rev);
    return response;
  } catch (error) {
    throw new Error("Failed to delete document: " + error.message);
  }
}

// Update a document by `_id`
async function updateDocument(id, newData) {
  try {
    const doc = await db.get(id);
    
    const updatedDoc = {
      "_id" : doc._id,
      "_rev" : doc._rev,       // Keep existing fields like `_id` and `_rev`
      ...newData               // Overwrite or add fields from newData
    };

    const response = await db.put(updatedDoc);
    return response;
  } catch (error) {
    throw new Error("Failed to update document: " + error.message);
  }
}

//wipe entire db
async function destroy() {
  try {
    await db.destroy();
  } catch {
    throw new Error("Failed to destroy database");
  }
};

// Other PouchDB operations can be added here

module.exports = { addDocument, addDocumentsList, getAllDocuments, deleteDocument, deleteDocumentById, updateDocument, destroy };