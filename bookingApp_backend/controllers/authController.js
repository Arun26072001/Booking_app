const Joi = require("joi");
const { Employee, empValidation } = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.addEmployee = async (req, res) => {
    try {
        const newEmp = {
            name: req.body.name,
            work: req.body.work,
            contact: req.body.contact,
            email: req.body.email,
            password: req.body.password,
            account: req.body.work === "Taxi Alloter" ? 3 :
                req.body.work === "Driver" ? 4 :
                    req.body.work === "Booking Officer" ? 2 :
                        req.body.work === "admin" ? 1 : 5
        }

        const validation = empValidation.validate(newEmp);
        const { error } = validation;
        if (error) {
            res.status(400).send({ error: error.details[0].message });
        } else {
            const [isEmpEmail, isEmpPhone] = await Promise.all([
                Employee.find({ email: newEmp.email }),
                Employee.find({ contact: newEmp.contact })])

            if (isEmpEmail.length > 0) {
                return res.status(400).send({ error: "Email already exist!" })
            }
            else if (isEmpPhone.length > 0) {
                return res.status(400).send({ error: "Contact already exist!" })
            }
            else {
                const emp = await Employee.create(newEmp);
                console.log(process.env.FRONTEND_BASEURL);

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });

                var mailOptions = {
                    from: process.env.EMAIL,
                    to: emp.email,
                    subject: `${emp.work} Invitation from RBC Travels`,
                    html: `<!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <title>RBC Travels</title>
                                    <style>
                                        @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap");
                                        * {
                                            font-family: 'Roboto', sans-serif;
                                        }
                                        .container {
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;
                                            background-color: #f4f4f4;
                                            padding: 20px;
                                        }
                                        .content {
                                            width: 300px;
                                            border-radius: 10px;
                                            padding: 20px;
                                            background: white;
                                            box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                                            font-size: 16px;
                                            color: #333;
                                        }
                                        h4 {
                                            text-align: center;
                                            margin-bottom: 10px;
                                            color: #333;
                                        }
                                        p {
                                            margin: 8px 0;
                                        }
                                        a {
                                            color: #007BFF;
                                            text-decoration: none;
                                        }
                                          .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff !important; text-decoration: none; border-radius: 5px; margin-top: 10px; }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="content">
                                        <h2>Welcome to RBC Travels</h2>
                                            <h4>Your Credentials</h4>
                                            <p>Email: <b>${emp.email}</b></p>
                                            <p>Password: <b>${emp.password}</b></p>
                                            <p>Your details has been register! Please confirm your email by clicking the button below.</p>
                                            <a href="${process.env.FRONTEND_BASEURL}" class="button">Verify Email</a>
                                        </div>
                                    </div>
                                </body>
                            </html>`
                };


                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(500).send({ message: error.message })
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(201).send({ message: "Employee has been created!" })
            }
        }
    } catch (err) {
        console.log(err);

        res.status(500).send({ error: err.message })
    }
}

exports.getEmployeeData = async (req, res) => {
    try {
        const emp = await Employee.findOne({ email: req.params.email }).exec();
        if (!emp) {
            return res.status(404).send({ error: "employee not found" })
        } else {
            return res.send(emp)
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message })
    }
}

exports.getEmployees = async (req, res) => {
    try {
        const emps = await Employee.find({}).exec();
        res.send(emps);
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

exports.loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send({ error: "Please Enter email And password" })
        } else {
            const emp = await Employee.findOne({ email, password });
            if (!emp) {
                res.status(400).send({ error: "Invalid Email or Password" })
            }
            else {
                const data = {
                    _id: emp._id,
                    account: emp.account,
                    name: emp.name,
                    email: emp.email
                }
                const encodeDataInToken = jwt.sign(data, process.env.PRIVATE_KEY);
                res.send(encodeDataInToken);
            }
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}

exports.updateEmployee = async (req, res) => {
    try {
        const { error } = empValidation.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message })
        } else {
            // const [isEmpEmail, isEmpPhone] = await Promise.all([
            //     Employee.find({ email: req.body.email }),
            //     Employee.find({ contact: req.body.contact })])

            // if (isEmpEmail.length > 0) {
            //     return res.status(400).send({ error: "Email already exist!" })
            // }
            // else if (isEmpPhone.length > 0) {
            //     return res.status(400).send({ error: "Contact already exist!" })
            // }

            const updatedData = {
                ...req.body,
                account: req.body.work === "Admin" ? 1 : req.body.work === "Booking Officer" ? 2 : req.body.work === "Taxi Allotor" ? 3 : req.body.work === "Driver" ? 4 : 5
            }
            const updatedEmp = await Employee.findByIdAndUpdate(req.params.id, updatedData, { new: true })
            return res.send({ message: `${req.body.name} data updated successfully`, updatedEmp })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error.message })
    }
}
exports.logoutUser = async (req, res) => {
    if (req.headers['authorization']) {
        req.headers.remove('authorization')
        res.status(200).send("logout.")
    }
}

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await Employee.findOne({ email: email });

    if (!user) {
        return res.status(404).send({ message: "Email not found please register." })
    } else {

        // send email for this link
        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/password/reset`;
        const resetPasswordToken = await user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });
        const message = `This is your reset password url ${resetPasswordUrl}\n\n
        if did't give that request, Please ignore it. ${resetPasswordToken}`

        try {
            const sendMailMsg = await sendEmail({
                email: email,
                subject: `Password reset mail from ${process.env.SMTP_FROM_EMAIL}`,
                message
            })
            return res.status(200).send({ message: "Email has been sent", sendMailMsg })

        } catch (err) {
            this.resetPasswordToken = undefined;
            this.resetPasswordTokenExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).send({ message: "error in send email to resetPassword", details: err.message })
        }
    }
}
