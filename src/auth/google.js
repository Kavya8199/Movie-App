
export const initGoogle = (clientId, callback) => {
  
  window.onload = function () {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: callback,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "outline", size: "large" }
    );
  };
};
