function _idToString(id) {
    if (!id) return null;
    if (typeof id === 'string') return id;
    if (id._id) return String(id._id);
    if (id.toString) return id.toString();
    return String(id);
}

function ensureOwnerOrAdmin(resource, user, ownerFields = ['addedBy', 'requestedBy', 'createdBy', 'user']) {
    if (!user) return false;
    const role = user.role || '';
    if (role === 'admin' || role === 'hospital') return true;

    const userId = user.id || user._id || user._id?.toString();
    if (!userId) return false;
    const uid = String(userId);

    for (const field of ownerFields) {
        const ownerVal = resource[field];
        if (!ownerVal) continue;
        const ownerId = _idToString(ownerVal);
        if (ownerId === uid) return true;
    }
    return false;
}

module.exports = { ensureOwnerOrAdmin };
