export function select(keys = [], obj = {}) {
    const selected = {}
    for (let key of keys) {
        selected[key] = obj[key]
    }
    return selected
}