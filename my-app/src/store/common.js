function save(key, data) {
    let value = ""
    if (data.constructor !== String()) {
        value = JSON.stringify(data)
    } else value = String(data)
    localStorage.setItem(key, value)
}

function read(key) {
    const data = localStorage.getItem(key)
    if(data?.includes("object Object")) throw new Error("invalid initialization")
    if(!data) throw new Error(`${key} not found in store`)
    try {
        const res = JSON.parse(data)
        return res
    } catch (error) {
        return data
    }
}

function deleteKey(key) {
    localStorage.removeItem(key)
}

const db = {
    save,
    read,
    deleteKey
}

export default db