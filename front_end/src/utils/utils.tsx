export const parseJSONWithNaN = (text: string) => {
    const sanitizedText = text.replace(/NaN/g, 'null');
    return JSON.parse(sanitizedText);
};