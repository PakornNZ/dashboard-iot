const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const axios = require("axios");

async function captureAndSend() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"
        ],
        executablePath: "/usr/bin/chromium"
    });

    const page = await browser.newPage();
    await page.goto("http://php-environment", { waitUntil: "networkidle2" });

    await page.evaluate(() => {
        const container = document.querySelector('.chart-container');
        container.style.width = '1035px';
        container.style.height = '400px';

        const canvas = document.getElementById('myChart');
        canvas.style.width = '100%';
        canvas.style.height = '100%';

    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const chartContainer = await page.$('.chart-container');
    if (!chartContainer) {
        console.error("Error: Chart container not found!");
        await browser.close();
        return;
    }

    const imagePath = "/app/screenshots/chart.png";
    await chartContainer.screenshot({ 
        path: imagePath,
        clip: {
            x: 40,
            y: 20,
            width: 1035,
            height: 400
        }
    });
    await browser.close();
    await sendEmail(imagePath);
}

async function fetchMaxData() {
    try {
        const response = await axios.get("http://php-environment/API/APISensor/fetchMax.php");
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function sendEmail(imagePath) {
    const maxData = await fetchMaxData();
    if (!maxData) return;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: 'pakorn.sk@rmuti.ac.th',
            pass: 'vxiw kwui bwva rbnm',
        },
    });

    const mailOptions = {
        from: '"NAF Dashboard" <pakorn.sk@rmuti.ac.th>',
        to: "pakornnz005@gmail.com, jetsada.sc@rmuti.ac.th, nattawat.pg@rmuti.ac.th",
        subject: "สรุปข้อมูลประจำวัน",
        html: `
            <div style="font-family: Kanit light; padding: 20px; border-radius: 10px; background: #f4f4f4;">
                <h2 style="color: white; background-color: #6f9bcb; padding: 10px; text-align: center; border-radius: 5px;">
                    สรุปข้อมูลประจำวันที่ <br>${new Date().toLocaleDateString('th-TH', {year: 'numeric', month: 'long', day: 'numeric'})}
                </h2>
                <div style="text-align: center; margin: 10px 0;">
                    <img src="cid:chart_image" style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 10px;" />
                </div>
                <table style="width: 100%; border-spacing: 8px; text-align: center;">
                    <tr>
                        <td style="width: 50%; background: #ffcccb; padding: 15px; border-radius: 10px;">
                            <h3 style="margin: 0; color: #d9534f;">Max Temperature</h3>
                            <p style="font-size: 22px; font-weight: bold; margin: 5px 0; color: #303030;"> ${maxData.maxtemp} °C</p>
                        </td>
                        <td style="width: 50%; background: #cce5ff; padding: 15px; border-radius: 10px;">
                            <h3 style="margin: 0; color: #0275d8;">Max Humidity</h3>
                            <p style="font-size: 22px; font-weight: bold; margin: 5px 0; color: #303030;"> ${maxData.maxhumi} %</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 50%; background: #fff3cd; padding: 15px; border-radius: 10px;">
                            <h3 style="margin: 0; color: #f0ad4e;">Max Light</h3>
                            <p style="font-size: 22px; font-weight: bold; margin: 5px 0; color: #303030;"> ${maxData.maxlight} Lux</p>
                        </td>
                        <td style="width: 50%; background: #d4edda; padding: 15px; border-radius: 10px;">
                            <h3 style="margin: 0; color: #5cb85c;">Max Water Flow</h3>
                            <p style="font-size: 22px; font-weight: bold; margin: 5px 0; color: #303030;"> ${maxData.maxwater} L/min</p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="background: rgb(227, 205, 255); padding: 15px; border-radius: 10px;">
                            <h3 style="margin: 0; color: rgb(127, 78, 240);">Max pH</h3>
                            <p style="font-size: 22px; font-weight: bold; margin: 5px 0; color: #303030;"> ${maxData.maxph} pH</p>
                        </td>
                    </tr>
                </table>
            </div>`,
        attachments: [
            {
                filename: "chart.png",
                path: imagePath,
                cid: "chart_image",
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        fs.unlinkSync(imagePath);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

captureAndSend();
