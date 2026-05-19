import React, { use, useEffect, useState } from "react";
import { BiUpArrowAlt } from "react-icons/bi";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { sp500csv } from "./sp500";

export default function App() {
  const [stocks, setStocks] = useState([]);
  const googleSheetsUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2wp7h7IrBmCRAUmZP5n0s_wl6dnGarUGgKdtxsBi9ef6qUFECVkYm1b_3V9BcJbdrdumdyHQaRA55/pub?output=csv";
  function parseCSV(csvText: string) {
    const stocks = [];
    const lines = csvText.split("\n");

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines or the header row
      if (
        !trimmedLine ||
        trimmedLine.startsWith("Symbol,Name") ||
        trimmedLine.startsWith('"Symbol","Name"')
      ) {
        continue;
      }

      // Split by comma ONLY if the comma is outside of matching double quotes
      const parts = trimmedLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      // Now it safely handles rows even if they have quotes/commas in the name
      if (parts.length >= 5) {
        const [symbol, name, priceStr, changeStr, percentStr] = parts;

        // Helper function to strip out quotes, spaces, currency symbols, and commas from numbers
        const cleanNumber = (str: string) => {
          if (!str) return 0;
          const cleaned = str.replace(/[$\s%"]/g, "").replace(/,/g, "");
          return parseFloat(cleaned) || 0;
        };

        stocks.push({
          symbol: symbol.replace(/"/g, "").trim(),
          name: name.replace(/"/g, "").trim(), // Cleans up the surrounding quotes around the name
          price: cleanNumber(priceStr),
          changeDollar: cleanNumber(changeStr),
          changePercent: cleanNumber(percentStr),
        });
      }
    }

    console.log("Successfully Parsed Stocks:", stocks);
    return stocks;
  }
  async function getInitialSP500Data() {
    //const res = await fetch(googleSheetsUrl);
    //const text = await res.text();
    const csvText = sp500csv;

    let stocks = parseCSV(sp500csv);
    return stocks;
  }

  async function getRefreshedSP500Data() {
    const res = await fetch(googleSheetsUrl);
    const text = await res.text();

    let stocks = parseCSV(sp500csv);
    return stocks;
  }

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data: any = await getInitialSP500Data();
        setStocks(data);
        console.log("Stocks updated:", new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Failed to fetch stock data:", err);
      }
    };

    const refreshStocks = async () => {
      try {
        const data: any = await getRefreshedSP500Data();
        setStocks(data);
        console.log("Stocks updated:", new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Failed to fetch stock data:", err);
      }
    };

    // fetch immediately on load
    fetchStocks();

    // refresh every hour
    const interval = setInterval(refreshStocks, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const content = (
    <>
      {stocks.map((stock: any) => (
        <div
          style={{
            paddingRight: "100px",
            display: "flex",
            gap: "10px",
            color: "#fff",
            alignItems: "center",
            fontWeight: "bold",
          }}
          key={stock.symbol}
        >
          <span>{stock.name}</span>
          <span>({stock.symbol})</span>
          {stock.changeDollar > 0 ? (
            <FaCaretUp size="40px" style={{ color: "green" }} />
          ) : stock.changeDollar < 0 ? (
            <FaCaretDown size="40px" style={{ color: "red" }} />
          ) : (
            <span style={{ fontSize: "40px", color: "gray" }}></span>
          )}

          <span
            style={{
              color:
                stock.changeDollar > 0
                  ? "green"
                  : stock.changeDollar < 0
                    ? "red"
                    : "gray",
            }}
          >
            ${stock.price}
          </span>
          <span>
            {stock.changeDollar > 0 ? "+" : ""}
            {stock.changeDollar}
          </span>
          <span
            style={{
              color:
                stock.changeDollar > 0
                  ? "green"
                  : stock.changeDollar < 0
                    ? "red"
                    : "gray",
            }}
          >
            {stock.changePercent}%
          </span>
        </div>
      ))}
    </>
  );

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        background: "#000",
      }}
    >
      <style>
        {`
          @keyframes marquee {
            from {
              transform: translateX(0%);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}
      </style>

      <div
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          animation: "marquee 2000s linear infinite",
          fontFamily: "Arial, sans-serif",
          color: "#333",
          fontSize: "24px",
        }}
      >
        {/* First copy */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {content}
        </div>

        {/* Second copy (for seamless loop) */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {content}
        </div>
      </div>
    </div>
  );
}
