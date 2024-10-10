"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import braintree from "braintree-web";

import styles from "./page.module.css";

export default function Home() {
  const [token, setToken] = useState(null);
  const [hostedInstance, setHostedInstance] = useState();
  useEffect(() => {
    async function getToken() {
      const { data } = await axios.get("/api/token");
      setToken(data);
      console.log("called");

      braintree.client.create(
        { authorization: data },
        function (err, instance) {
          if (instance) {
            braintree.hostedFields.create(
              {
                client: instance,
                styles: {
                  input: {
                    color: "black",
                  },
                },
                fields: {
                  number: {
                    selector: "#card-number",
                    placeholder: "4111 1111 1111 1111",
                  },
                  cardholderName: {
                    selector: "#cardholder-name",
                  },
                  expirationDate: {
                    selector: "#expiration-date",
                  },
                  cvv: {
                    selector: "#cvc",
                  },
                },
              },
              function (err, hostedInstance) {
                setHostedInstance(hostedInstance);
              }
            );
          }
        }
      );
    }
    getToken();
  }, []);

  const submit = async () => {
    const nonce = hostedInstance.tokenize((err, payload) => {
      console.log(err, payload);
    });
  };
  return (
    <form className={styles.container}>
      <h1>Payment</h1>
      <div className={styles.form}>
        <div className={styles.input}>
          <label htmlFor="card-number" className={styles.label}>
            Card Number
          </label>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
          >
            <path
              d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"
              fill="black"
              fill-opacity="0.56"
            />
          </svg>
          <div id="card-number" className={styles["field-icon"]} />
        </div>
        <div className={styles.input}>
          <label htmlFor="cardholder-name" className={styles.label}>
            Cardholder Name
          </label>
          <div id="cardholder-name" className={styles.field} />
        </div>
        <div className={styles.group}>
          <div className={styles["input-small"]}>
            <label htmlFor="expiration-date" className={styles.label}>
              Expiration Date
            </label>
            <div id="expiration-date" className={styles.field} />
          </div>
          <div className={styles["input-small"]}>
            <label htmlFor="cvc" className={styles.label}>
              CVC / CVC2
            </label>
            <div id="cvc" className={styles.field} />
          </div>
        </div>
      </div>
    </form>
  );
}
