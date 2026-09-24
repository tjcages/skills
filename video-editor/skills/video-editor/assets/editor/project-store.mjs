// One atomic record keeps media and the recipe from different edits together.
let database;
function open() {
  return (database ||= new Promise((resolve, reject) => {
    const request = indexedDB.open("video-editor-studio", 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("projects");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }));
}
export async function readProject() {
  const db = await open();
  return new Promise((resolve, reject) => {
    const request = db
      .transaction("projects")
      .objectStore("projects")
      .get("current");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function writeProject(project) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("projects", "readwrite");
    transaction.objectStore("projects").put(project, "current");
    transaction.oncomplete = resolve;
    transaction.onerror = transaction.onabort = () =>
      reject(transaction.error || Error("Saving interrupted"));
  });
}
