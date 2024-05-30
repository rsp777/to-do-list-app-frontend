function createSignInJson() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const userData = {
      username: username,
      passwordHash: password,
    };
    // return taskData;
    signin(userData);
  }

  async function signin(userData) {
    const url =
      "http://" + window.location.hostname + ":8083/login-service/signin";
    const jsonData = userData;
    //const authToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyYXNwYXciLCJleHAiOjE3MTY2MDM4NjEsImlhdCI6MTcxNjU1Mzg2MX0.e-raKxRebWR95nFsFvxRnYBpUPIIz_e8aj6730PgD7maReoPlHWlf_mnRtRs1uIF9u-mXiFmW-BsLfdOcI2srA';
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Replace with your actual authorization token
        },
        body: JSON.stringify(jsonData),
      });
      if (response.ok) {
        const result = await response.json();
        const jwtToken = result.token;
        document.cookie = "myToken=" + jwtToken;
        console.log("result : ", document.cookie);
        // alert('User Created Successfully');
        const taskUrl =
          "http://" + window.location.hostname + ":8080/tasklist.html";
        console.log(taskUrl);
        window.location.href = taskUrl;
      } else {
        alert(
          "Error logging in with username:",
          response.status,
          response.statusText
        );
        console.error(
          "Error logging in with username:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      alert("An error occurred while logging in:", error);
      console.error("An error occurred while logging in:", error);
    }
  }