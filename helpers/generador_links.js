function generarLinksRecurso(req, baseEndpoint, id) {
    const baseUrl = `${req.protocol}://${req.get('host')}${baseEndpoint}`;
    return [
        { rel: "self", method: "GET", href: `${baseUrl}/${id}` },
        { rel: "update", method: "PATCH", href: `${baseUrl}/${id}` },
        { rel: "delete", method: "DELETE", href: `${baseUrl}/${id}` }
    ];
}

module.exports = {
    generarLinksRecurso
};