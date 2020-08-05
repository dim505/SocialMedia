//function to check if something is empty
export function isEmpty(str) {
  return !str || /^\s*$/.test(str);
}

//generates a GUID
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//this formats the format so It can be used in the browser
export function FormatImage(image, contentType) {
  //CreateImageUrl -- // creates a URl to view the image
  const data = image;

  //base64ToArrayBuffer - converts string from data bases to an array buffer
  const binaryString = window.atob(data); // Comment this if not using base64
  const bytes = new Uint8Array(binaryString.length);
  const arrayBuffer = bytes.map((byte, i) => binaryString.charCodeAt(i));

  const blob = new Blob([arrayBuffer], {
    type: contentType,
  });
  const objectURL = URL.createObjectURL(blob);
  return objectURL;
}
 