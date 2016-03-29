module.exports.textTrimmer = function(string, size) {
    var trimmedString = string.substr(0, size);
    return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + ' ...';
}
