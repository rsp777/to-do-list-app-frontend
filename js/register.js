 function createUserJson() {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        console.log("User Name", username);
        const userData = {
          username: username,
          email: email,
          passwordHash: password,
        };
        // return taskData;
        register(userData);
      }

      async function register(userData) {
        const url =
          "http://" +
          window.location.hostname +
          ":8082/register-service/register";
        const jsonData = userData;
        console.log("user json : {}", jsonData);
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
          console.log(response);
          if (response.ok) {
            const result = await response.json();
            alert("User Created Successfully");
            window.location.reload();
          } else {
            alert("Error creating user:", response.status, response.statusText);
            console.error(
              "Error creating user:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          alert("An error occurred while creating the user:", error);

          console.error("An error occurred while creating the user:", error);
        }
      }