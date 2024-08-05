const scanner = new Html5QrcodeScanner("reader", {
  qrbox: {
    width: 250,
    height: 250,
  },
  fps: 20,
});

scanner.render(success, error);

function success(result) {
  try {
    const parsedResult = JSON.parse(result);

    localStorage.setItem("qrResult", JSON.stringify(parsedResult));

    document.getElementById("result").innerHTML = `
      <h2>Success!</h2>
    `;

    scanner.clear();
    document.getElementById("reader").remove();

    setTimeout(() => {
      window.location.href = "nurse";
    }, 1000);
  } catch (e) {
    console.error("Error processing QR code:", e);
    document.getElementById("result").innerHTML = `
      <h2>Error!</h2>
      <p>Invalid QR Code</p>
    `;
  }
}

function error(err) {
  console.error(err);
}
