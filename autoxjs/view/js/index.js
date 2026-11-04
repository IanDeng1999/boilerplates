const winOnloadBak = window.onload ? window.onload.bind(window) : null;

window.onload = () => {
  if (typeof winOnloadBak === "function") {
    winOnloadBak();
  }
  document.getElementById("testButton").addEventListener("click", () => {
    $autojs.invoke(
      "start:screen-shot",
      JSON.stringify({
        foo: "bar",
      }),
    );
  });
};
