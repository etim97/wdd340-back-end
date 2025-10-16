const accountModel = require("../models/accountModel");

exports.buildAccountManagement = (req, res) => {
  const accountData = req.account; // make sure this matches your middleware
  res.render("account/management", {
    title: "Account Management",
    accountData,
    account_firstname: accountData.account_firstname,
    message: req.flash("message")
  });
};

exports.buildUpdateAccountView = async (req, res) => {
    const account_id = req.params.id;
    const account = await accountModel.getAccountById(account_id);
    res.render("account/update-account", {
        title: "Update Account",
        account,
        message: req.flash("message")
    });
};

exports.updateAccountInfo = async (req, res) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
}


//const accountModel = require("../models/accountModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

exports.buildLogin = (req, res) => {
    res.render("account/login", { title: "Login", message: null })
}

exports.buildRegister = (req, res) => {
    res.render("account/register", { title: "Register", message: null })
}

exports.registerClient = async (req, res) => {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);
try {
    const result = await accountModel.register(account_firstname, account_lastname, account_email, hashedPassword);

    if (result) {
      req.flash("message", "Registration successful. Please log in.");
      return res.redirect("/account/login");
    } else {
      return res.render("account/register", {
        title: "Register",
        message: "Error registering user"
      });
    }
  } catch (err) {
    console.error("Registration error:", err);
    return res.render("account/register", {
      title: "Register",
      message: "Error registering user"
    });
  }
};



  exports.loginClient = async (req, res) => {
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.findByEmail(account_email);

  if (!accountData) {
    return res.render("account/login", {
      title: "Login",
      message: "Invalid credentials",
      account_email
    });
  }

  const match = await bcrypt.compare(account_password, accountData.account_password);
  if (!match) {
    return res.render("account/login", {
      title: "Login",
      message: "Invalid password",
      account_email
    });
  }

console.log("Creating token for:", accountData.account_email);

    const tokenPayload = {
    account_id: accountData.account_id,
    account_email: accountData.account_email
  };

  const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h"
  });

  console.log("Token created:", token);


  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60
  });
console.log("JWT cookie set");

console.log("Redirecting to account management");
  res.redirect("/account/management");
};

    exports.updateAccountInfo = async (req, res) => {
        const { account_id, account_firstname, account_lastname, account_email } = req.body;

        try {
            const result = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);

            if (result) {
                req.flash("message", "Account updated successfully.");
                res.redirect("/account/management");
            } else {
                req.flash("message", "Update failed.");
                res.redirect(`/account/update/${account_id}`);
            }
        } catch (err) {
            console.error("Update error:", err);
            req.flash("message", "Error updating account.");
            res.redirect(`/account/update/${account_id}`);
        }
    };

    //const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
    //res.cookie("jwt", token, { httpOnly: true })
    //res.redirect("/account/")


exports.logoutClient = (req, res) => {
    res.clearCookie("jwt")
    res.redirect("/")
}
