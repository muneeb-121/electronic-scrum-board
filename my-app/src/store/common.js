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

export function filterResourceList (resource, key, param) {
    save(resource, read(resource).filter(x => x[key] !== param))
}

export function addToResourceList (resource, param) {
    let resourceList = read(resource)
    if (Array.isArray(param)) {
        resourceList = resourceList.concat(param)
    } else resourceList = resourceList.concat([param])
    save(resource, resourceList)
}

export function updateResourceFromList(resource, guid, param) {
    let resourceList = read(resource)
    const index = resourceList.findIndex(x => x.guid === guid)
    resourceList[index] = { ...resourceList[index], ...param}
    save(resource, resourceList)
}

const db = {
    save,
    read,
    deleteKey,
    filterResourceList,
    addToResourceList,
    updateResourceFromList
}

export default db