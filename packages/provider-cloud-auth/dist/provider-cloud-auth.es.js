var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { seedUtils, libs } from "@waves/waves-transactions";
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { Flex, Text, ExternalLink, Button, Box, Input, InputPassword, DotLoader, Checkbox, Icon, PlateNote, IconButton, iconExpandAccordion, iconClose } from "@waves.exchange/react-uikit";
import * as React from "react";
import React__default, { useState, useRef, useEffect, useCallback } from "react";
class MemoryStorage {
  constructor() {
    __publicField(this, "dataMemory", {});
  }
  setItem(key, value) {
    this.dataMemory[key] = value;
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.dataMemory, key) ? this.dataMemory[key] : null;
  }
  removeItem(key) {
    delete this.dataMemory[key];
  }
  clear() {
    this.dataMemory = {};
  }
}
class IdentityService {
  constructor() {
    __publicField(this, "geetestUrl", "");
    __publicField(this, "storage", new MemoryStorage());
    __publicField(this, "userPool");
    __publicField(this, "currentUser");
    __publicField(this, "identityUser");
    __publicField(this, "username", "");
    __publicField(this, "seed", seedUtils.Seed.create());
    __publicField(this, "apiUrl", "");
  }
  configure({
    apiUrl,
    clientId,
    userPoolId,
    endpoint,
    geetestUrl
  }) {
    this.apiUrl = apiUrl;
    this.userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
      Storage: this.storage,
      endpoint
    });
    this.geetestUrl = geetestUrl;
  }
  getUsername() {
    if (!this.username) {
      return "";
    }
    const [name, domain] = this.username.split("@");
    return `${name[0]}********@${domain}`;
  }
  getUserAddress() {
    return this.identityUser ? this.identityUser.address : "";
  }
  getUserPublicKey() {
    return this.identityUser ? this.identityUser.publicKey : "";
  }
  async signUp(username, password, meta) {
    return new Promise((resolve, reject) => {
      if (!this.userPool) {
        return reject(new Error("No UserPool"));
      }
      const clientMetadata = __spreadValues({}, meta);
      this.userPool.signUp(username, password, [
        new CognitoUserAttribute({
          Name: "email",
          Value: username
        })
      ], null, (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result) {
          return reject(new Error("Not authenticated"));
        }
        this.currentUser = result.user;
        resolve(result);
      }, clientMetadata);
    });
  }
  async confirmSignUp(code) {
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        return reject(new Error("No User"));
      }
      this.currentUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
  async resendSignUp() {
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        return reject(new Error("No User"));
      }
      this.currentUser.resendConfirmationCode((err, result) => {
        if (err) {
          return reject(err);
        }
        resolve({
          type: result.CodeDeliveryDetails.DeliveryMedium,
          destination: result.CodeDeliveryDetails.Destination
        });
      }, {
        "custom:encryptionKey": this.seed.keyPair.publicKey
      });
    });
  }
  async signIn(username, password, metaData) {
    this.currentUser = void 0;
    this.identityUser = void 0;
    this.username = username;
    return new Promise((resolve, reject) => {
      if (!this.userPool) {
        return reject(new Error("No UserPool"));
      }
      const user = new CognitoUser({
        Username: username,
        Pool: this.userPool,
        Storage: this.storage
      });
      this.currentUser = user;
      this.currentUser.authenticateUser(new AuthenticationDetails({
        Username: username,
        Password: password,
        ClientMetadata: __spreadValues({
          "custom:encryptionKey": this.seed.keyPair.publicKey
        }, metaData)
      }), {
        onSuccess: async () => {
          const identityUser = await this.fetchIdentityUser();
          this.identityUser = identityUser;
          delete user["challengeName"];
          delete user["challengeParam"];
          resolve(user);
        },
        onFailure: (err) => {
          reject(err);
        },
        customChallenge: function(challengeParam) {
          user["challengeName"] = "CUSTOM_CHALLENGE";
          user["challengeParam"] = challengeParam;
          resolve(user);
        },
        mfaRequired: function(challengeName, challengeParam) {
          user["challengeName"] = challengeName;
          user["challengeParam"] = challengeParam;
          resolve(user);
        },
        mfaSetup: function(challengeName, challengeParam) {
          user["challengeName"] = challengeName;
          user["challengeParam"] = challengeParam;
          resolve(user);
        },
        newPasswordRequired: function(userAttributes, requiredAttributes) {
          user["challengeName"] = "NEW_PASSWORD_REQUIRED";
          user["challengeParam"] = {
            userAttributes,
            requiredAttributes
          };
          resolve(user);
        },
        totpRequired: function(challengeName, challengeParam) {
          user["challengeName"] = challengeName;
          user["challengeParam"] = challengeParam;
          resolve(user);
        },
        selectMFAType: function(challengeName, challengeParam) {
          user["challengeName"] = challengeName;
          user["challengeParam"] = challengeParam;
          resolve(user);
        }
      });
    });
  }
  async confirmSignIn(code, mfaType) {
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        return reject(new Error("Not authenticated"));
      }
      this.currentUser.sendMFACode(code, {
        onSuccess: async (session) => {
          if (this.currentUser) {
            delete this.currentUser["challengeName"];
            delete this.currentUser["challengeParam"];
          }
          if (session && !this.identityUser) {
            const identityUser = await this.fetchIdentityUser();
            this.identityUser = identityUser;
            resolve();
          }
        },
        onFailure: (err) => {
          reject(err);
        }
      }, mfaType, {
        "custom:encryptionKey": this.seed.keyPair.publicKey
      });
    });
  }
  signOut() {
    if (this.currentUser) {
      this.currentUser.signOut();
    }
    this.currentUser = void 0;
    this.identityUser = void 0;
    this.username = "";
    return Promise.resolve();
  }
  deleteUser() {
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        return reject(new Error("Not authenticated"));
      }
      this.currentUser.deleteUser(async (err, result) => {
        if (err) {
          reject(err);
        } else {
          try {
            await this.signOut();
            resolve(result);
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }
  async signBytes(bytes) {
    await this.refreshSessionIsNeed();
    const signature = libs.crypto.base58Decode(libs.crypto.signBytes(this.seed.keyPair, bytes));
    const response = await this.signByIdentity({
      payload: libs.crypto.base64Encode(bytes),
      signature: libs.crypto.base64Encode(signature)
    });
    return libs.crypto.base58Encode(libs.crypto.base64Decode(response.signature));
  }
  getIdToken() {
    if (!this.currentUser) {
      throw new Error("Not authenticated");
    }
    const session = this.currentUser.getSignInUserSession();
    if (!session) {
      throw new Error("Not authenticated");
    }
    return session.getIdToken();
  }
  refreshSessionIsNeed() {
    const token = this.getIdToken();
    const payload = token.decodePayload();
    const currentTime = Math.ceil(Date.now() / 1e3);
    const currentPublicKey = this.seed.keyPair.publicKey;
    const isValidTime = payload.exp - currentTime > 10;
    const isValidPublicKey = payload["custom:encryptionKey"] === currentPublicKey;
    if (isValidPublicKey && isValidTime) {
      return Promise.resolve();
    }
    return this.refreshSession();
  }
  async refreshSession() {
    const meta = { "custom:encryptionKey": this.seed.keyPair.publicKey };
    return new Promise((resolve, reject) => {
      if (!this.currentUser) {
        return reject(new Error("Not authenticated"));
      }
      this.currentUser.updateAttributes([
        new CognitoUserAttribute({
          Name: "custom:encryptionKey",
          Value: this.seed.keyPair.publicKey
        })
      ], (err) => {
        if (err) {
          return reject(err);
        }
        if (!this.currentUser) {
          return reject(new Error("Not authenticated"));
        }
        const session = this.currentUser.getSignInUserSession();
        if (!session) {
          return reject(new Error("Not authenticated"));
        }
        const resfeshToken = session.getRefreshToken();
        this.currentUser.refreshSession(resfeshToken, (err2, data) => {
          if (err2) {
            return reject(err2);
          }
          resolve(data);
        }, meta);
      }, meta);
    });
  }
  async fetchIdentityUser() {
    const token = this.getIdToken().getJwtToken();
    const itentityUserResponse = await fetch(`${this.apiUrl}/v1/user`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const identityUser = await itentityUserResponse.json();
    return identityUser;
  }
  async signByIdentity(body) {
    const token = this.getIdToken().getJwtToken();
    const response = await fetch(`${this.apiUrl}/v1/sign`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const result = await response.json();
    return result;
  }
}
const getEnvAwareUrl = (pathname) => {
  const origin = window.location.origin.includes("localhost") ? "https://waves.exchange" : window.location.origin;
  if (!pathname)
    return origin;
  if (!pathname.startsWith("/"))
    throw new Error("Pathname should start with /");
  return `${origin}${pathname}`;
};
const ForgotPassword = ({
  onSignInClick,
  onSignUpClick
}) => {
  return /* @__PURE__ */ React__default.createElement(Flex, {
    as: "form",
    px: "$40",
    pb: "$40",
    flexDirection: "column",
    justifyContent: "center"
  }, /* @__PURE__ */ React__default.createElement(Text, {
    variant: "body2",
    color: "basic.$500",
    textAlign: "center",
    mb: "32px"
  }, "Don't worry! You can reset password at", " ", /* @__PURE__ */ React__default.createElement(ExternalLink, {
    href: getEnvAwareUrl(),
    target: "_blank"
  }, "waves.exchange"), " ", "and then go back to continue the login process"), /* @__PURE__ */ React__default.createElement(Flex, {
    justifyContent: "space-between"
  }, /* @__PURE__ */ React__default.createElement(Button, {
    flex: 1,
    variantSize: "medium",
    mr: "32px",
    color: "primary.$300",
    border: "1px solid",
    borderColor: "primary.$300",
    backgroundColor: "transparent",
    onClick: onSignUpClick
  }, "Sign Up"), /* @__PURE__ */ React__default.createElement(Button, {
    flex: 1,
    variant: "primary",
    variantSize: "medium",
    onClick: onSignInClick
  }, "Log In")));
};
const InputWrapper = (_a) => {
  var _b = _a, {
    label,
    labelVisible,
    children,
    as: _as
  } = _b, rest = __objRest(_b, [
    "label",
    "labelVisible",
    "children",
    "as"
  ]);
  return /* @__PURE__ */ React__default.createElement(Box, __spreadValues({
    position: "relative",
    sx: {
      "&::before": {
        content: `"${label}"`,
        position: "absolute",
        top: "4px",
        left: "20px",
        color: "basic.$500",
        fontSize: "9px",
        zIndex: 1,
        transition: "opacity 0.15s ease-in",
        opacity: labelVisible ? 1 : 0
      }
    }
  }, rest), children);
};
const SignInForm = ({
  signIn,
  onForgotPasswordClick,
  onSignUpClick,
  signUpEmail
}) => {
  const [pending, setPenging] = useState(false);
  const [errors, setErrors] = useState({
    _form: null,
    emailRequired: null,
    passwordRequired: null
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const mounted = useRef(false);
  useEffect(() => {
    if (signUpEmail) {
      setEmail(signUpEmail);
    }
  }, [signUpEmail]);
  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value.trim());
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      _form: null,
      emailRequired: null
    }));
  }, []);
  const handleEmailBlur = useCallback(() => {
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      emailRequired: email.length === 0 || /.+@.+\..+/.test(email) === false ? "Enter correct email" : null
    }));
  }, [email]);
  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      _form: null,
      passwordRequired: null
    }));
  }, []);
  const handlePasswordBlur = useCallback(() => {
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      passwordRequired: password.length === 0 ? "Enter password" : null
    }));
  }, [password.length]);
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setPenging(true);
    try {
      await signIn(email, password);
    } catch (e) {
      if (e) {
        const limitExceededMessage = "You have exceeded incorrect username or password limit. If you have any problems, please contact support https://support.waves.exchange/.";
        setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
          _form: e.message === limitExceededMessage ? "Attempt limit exceeded, please try after some time." : e.message || JSON.stringify(e)
        }));
      }
    } finally {
      if (mounted.current) {
        setPenging(false);
      }
    }
  }, [email, password, signIn]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });
  const isSubmitEnabled = Object.entries(errors).filter(([_key, value]) => Boolean(value)).length === 0;
  return /* @__PURE__ */ React__default.createElement(Flex, {
    as: "form",
    px: "$40",
    pb: "24px",
    flexDirection: "column",
    justifyContent: "center"
  }, /* @__PURE__ */ React__default.createElement(Box, {
    mb: "24px"
  }, /* @__PURE__ */ React__default.createElement(InputWrapper, {
    mb: "16px",
    label: "Email",
    labelVisible: email.length > 0
  }, /* @__PURE__ */ React__default.createElement(Input, {
    inputMode: "email",
    placeholder: "Email",
    value: email,
    autoFocus: true,
    "aria-invalid": Boolean(errors.emailRequired),
    onChange: handleEmailChange,
    onBlur: handleEmailBlur
  }), errors.emailRequired && /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "12px",
    lineHeight: "14px",
    color: "danger.$300",
    textAlign: "left",
    display: "inline-block",
    width: "100%"
  }, errors.emailRequired)), /* @__PURE__ */ React__default.createElement(InputWrapper, {
    mb: "8px",
    label: "Password",
    labelVisible: password.length > 0
  }, /* @__PURE__ */ React__default.createElement(InputPassword, {
    placeholder: "Password",
    value: password,
    "aria-invalid": Boolean(errors.passwordRequired),
    onChange: handlePasswordChange,
    onBlur: handlePasswordBlur,
    autoComplete: "foo"
  }), /* @__PURE__ */ React__default.createElement(Box, {
    mt: "8px"
  }, errors.passwordRequired && /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "13px",
    lineHeight: "16px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block"
  }, errors.passwordRequired), errors._form && /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "13px",
    lineHeight: "16px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block"
  }, errors._form), /* @__PURE__ */ React__default.createElement(Button, {
    sx: { float: "right" },
    p: "0",
    fontSize: "13px",
    lineHeight: "16px",
    color: "primary.$300",
    backgroundColor: "transparent",
    borderWidth: "0",
    onClick: onForgotPasswordClick
  }, "Forgot password?")))), /* @__PURE__ */ React__default.createElement(Button, {
    type: "submit",
    variant: "primary",
    variantSize: "medium",
    mb: "24px",
    onClick: handleSubmit,
    disabled: pending || !isSubmitEnabled
  }, pending ? /* @__PURE__ */ React__default.createElement(Flex, {
    justifyContent: "center",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(DotLoader, null)) : /* @__PURE__ */ React__default.createElement(Text, null, "Log In")), /* @__PURE__ */ React__default.createElement(Box, {
    textAlign: "center"
  }, /* @__PURE__ */ React__default.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    textAlign: "center",
    display: "block",
    mb: "10px",
    lineHeight: "16px",
    fontWeight: 300
  }, "Do not have an account?"), /* @__PURE__ */ React__default.createElement(Button, {
    width: "124px",
    bg: "transparent",
    color: "primary.$300",
    border: "1px solid",
    borderColor: "primary.$300",
    variantSize: "small",
    height: "32px",
    onClick: onSignUpClick
  }, "Sign Up")));
};
const SignUpForm = ({
  signUp,
  onSignInClick,
  sendAnalytics
}) => {
  const MIN_PASSWORD_LENGTH = 8;
  const [isPending, setPending] = useState(false);
  const [errors, setErrors] = useState({
    _form: null,
    emailRequired: null,
    passwordsDoNotMatch: null,
    passwordMinLength: null,
    passwordInsecure: null
  });
  const [isPrivacyAccepted, setPrivacyAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value.trim());
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      _form: null,
      emailRequired: null
    }));
  }, []);
  const handleEmailBlur = useCallback(() => {
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      emailRequired: email.length === 0 || /.+@.+\..+/.test(email) === false ? "Enter correct email" : null
    }));
  }, [email]);
  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      _form: null,
      passwordsDoNotMatch: null,
      passwordMinLength: null,
      passwordInsecure: null
    }));
  }, []);
  const handlePasswordConfirmChange = useCallback((event) => {
    setPasswordConfirm(event.target.value);
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      _form: null,
      passwordsDoNotMatch: null
    }));
  }, []);
  const handlePrivacyAcceptedChange = useCallback(() => {
    setPrivacyAccepted((prev) => !prev);
  }, []);
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      setPending(true);
      await signUp(email, password);
      setPending(false);
      if (typeof sendAnalytics === "function") {
        sendAnalytics({ name: "Login_Page_SignUp_Success" });
      }
    } catch (e) {
      setPending(false);
      if (e && "code" in e) {
        if (e.code === "UsernameExistsException") {
          setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
            _form: "This email is already registered. Log in or use another email"
          }));
        } else {
          const limitExceededMessage = "You have exceeded incorrect username or password limit. If you have any problems, please contact support https://support.waves.exchange/.";
          setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
            _form: e.message === limitExceededMessage ? "Attempt limit exceeded, please try after some time." : e.message
          }));
        }
      } else {
        throw e;
      }
    }
  }, [email, password, signUp]);
  const handlePasswordInputBlur = useCallback(() => {
    const passwordMissedReqList = [
      /[a-z]/.test(password) || "lowercase letter",
      /[A-Z]/.test(password) || "uppercase letter",
      /[0-9]/.test(password) || "number",
      /[$-/:-?{-~!^_`[\]@#]/.test(password) || "special character"
    ].filter((x) => typeof x === "string");
    setErrors((prev) => __spreadProps(__spreadValues({}, prev), {
      passwordMinLength: password.length < MIN_PASSWORD_LENGTH ? "The password must be at least 8 characters long" : null,
      passwordInsecure: passwordMissedReqList.length ? `Easy, add a ${passwordMissedReqList.join(", ")}` : null,
      passwordsDoNotMatch: password.length > 0 && passwordConfirm.length > 0 && passwordConfirm !== password ? "Passwords do not match" : null
    }));
  }, [passwordConfirm, password]);
  const isSubmitEnabled = isPrivacyAccepted && Object.entries(errors).filter(([_key, value]) => Boolean(value)).length === 0;
  return /* @__PURE__ */ React__default.createElement(Flex, {
    as: "form",
    px: "$40",
    pb: "$30",
    flexDirection: "column",
    justifyContent: "center"
  }, /* @__PURE__ */ React__default.createElement(Box, {
    mb: "24px"
  }, /* @__PURE__ */ React__default.createElement(InputWrapper, {
    mb: "16px",
    label: "Enter Email",
    labelVisible: email.length > 0
  }, /* @__PURE__ */ React__default.createElement(Input, {
    inputMode: "email",
    placeholder: "Enter Email",
    value: email,
    autoFocus: true,
    "aria-invalid": Boolean(errors.emailRequired),
    onChange: handleEmailChange,
    onBlur: handleEmailBlur
  }), errors.emailRequired && /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "12px",
    lineHeight: "14px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block",
    width: "100%"
  }, errors.emailRequired)), /* @__PURE__ */ React__default.createElement(InputWrapper, {
    mb: "16px",
    label: "Create Password",
    labelVisible: password.length > 0
  }, /* @__PURE__ */ React__default.createElement(InputPassword, {
    placeholder: "Create Password",
    value: password,
    "aria-invalid": Boolean(errors.passwordMinLength || errors.passwordInsecure),
    onChange: handlePasswordChange,
    onBlur: handlePasswordInputBlur,
    autoComplete: "foo"
  }), /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "12px",
    lineHeight: "14px",
    color: "basic.$700",
    textAlign: "left",
    display: "inline-block",
    py: "4px"
  }, "Password must contain numbers, special characters, upper and lower case letters of the Latin alphabet and be at least ", MIN_PASSWORD_LENGTH, " characters long"), errors.passwordMinLength && /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "12px",
    lineHeight: "14px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block",
    width: "100%"
  }, errors.passwordMinLength), errors.passwordInsecure && /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "12px",
    lineHeight: "14px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block",
    width: "100%"
  }, errors.passwordInsecure)), /* @__PURE__ */ React__default.createElement(InputWrapper, {
    mb: "8px",
    label: "Confirm Password",
    labelVisible: passwordConfirm.length > 0
  }, /* @__PURE__ */ React__default.createElement(InputPassword, {
    placeholder: "Confirm Password",
    value: passwordConfirm,
    "aria-invalid": Boolean(errors.passwordsDoNotMatch),
    onChange: handlePasswordConfirmChange,
    onBlur: handlePasswordInputBlur,
    autoComplete: "foo"
  }), errors.passwordsDoNotMatch && /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "12px",
    lineHeight: "12px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block",
    width: "100%"
  }, errors.passwordsDoNotMatch))), /* @__PURE__ */ React__default.createElement(Flex, {
    alignItems: "center",
    mb: "24px"
  }, /* @__PURE__ */ React__default.createElement(Checkbox, {
    color: "standard.$0",
    checked: isPrivacyAccepted,
    onChange: handlePrivacyAcceptedChange
  }, /* @__PURE__ */ React__default.createElement(Text, {
    pl: "$10",
    variant: "body2"
  }, "I have read and agree with the\xA0")), /* @__PURE__ */ React__default.createElement(ExternalLink, {
    href: getEnvAwareUrl("/files/Privacy_Policy_Waves.Exchange.pdf"),
    variant: "body2"
  }, "Privacy Policy"), /* @__PURE__ */ React__default.createElement(Text, {
    variant: "body2",
    color: "standard.$0"
  }, "\xA0&\xA0"), /* @__PURE__ */ React__default.createElement(ExternalLink, {
    href: getEnvAwareUrl("/files/Terms_Of_Use_Waves.Exchange.pdf"),
    variant: "body2",
    target: "_blank"
  }, "Terms and Conditions")), errors._form && /* @__PURE__ */ React__default.createElement(Box, {
    mb: "24px"
  }, /* @__PURE__ */ React__default.createElement(Text, {
    fontSize: "12px",
    lineHeight: "14px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block",
    width: "100%"
  }, errors._form)), /* @__PURE__ */ React__default.createElement(Button, {
    type: "submit",
    variant: "primary",
    variantSize: "medium",
    mb: "24px",
    onClick: handleSubmit,
    disabled: !isSubmitEnabled
  }, isPending ? /* @__PURE__ */ React__default.createElement(Flex, {
    justifyContent: "center",
    alignItems: "center"
  }, /* @__PURE__ */ React__default.createElement(DotLoader, null)) : /* @__PURE__ */ React__default.createElement(Text, null, "Create Account")), /* @__PURE__ */ React__default.createElement(Text, {
    variant: "body2",
    color: "standard.$0",
    textAlign: "center"
  }, "Already have an account?", /* @__PURE__ */ React__default.createElement(Button, {
    color: "primary.$300",
    backgroundColor: "transparent",
    borderWidth: "0",
    onClick: onSignInClick
  }, "Log In")));
};
var imgUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NzEiIGhlaWdodD0iMTc0IiBmaWxsPSJub25lIiB2aWV3Qm94PSIwIDAgNDcxIDE3NCI+CiAgICA8bWFzayBpZD0idjI1ZzcxajFyYSIgd2lkdGg9IjQ3MSIgaGVpZ2h0PSIxNzQiIHg9IjAiIHk9IjAiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgIDxwYXRoIGZpbGw9IiNDNEM0QzQiIGQ9Ik0wIDBINDcxVjE3NEgweiIvPgogICAgPC9tYXNrPgogICAgPGcgbWFzaz0idXJsKCN2MjVnNzFqMXJhKSI+CiAgICAgICAgPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CiAgICAgICAgICAgIDxwYXRoIGZpbGw9IiNCN0JGRDEiIGQ9Ik00MjIuMjQ1IDgyLjc4OGwtLjE5NCAyLjg1OSAyLjI1MSAxLjc3NS0yLjc3LjcwNi0xIDIuNjg5LTEuNTI1LTIuNDIzLTIuODY4LS4xMTMgMS44MzYtMi4yMDYtLjc4MS0yLjc1NSAyLjY2NCAxLjA2MSAyLjM4Ny0xLjU5M3pNNS45MDggMTExLjAwNmwtLjE5MyAyLjg2IDIuMjUgMS43NzUtMi43NjkuNzA2LTEgMi42ODgtMS41MjUtMi40MjItMi44NjktLjExMyAxLjgzNi0yLjIwNy0uNzgtMi43NTVMMy41MiAxMTIuNmwyLjM4Ny0xLjU5NHpNMjM2LjU1NSAxMS43OTNsLS4xOTQgMi44NiAyLjI1MiAxLjc3NS0yLjc3LjcwNi0xIDIuNjg4LTEuNTI1LTIuNDIyLTIuODY5LS4xMTMgMS44MzYtMi4yMDctLjc4LTIuNzU1IDIuNjYzIDEuMDYyIDIuMzg3LTEuNTk0eiIvPgogICAgICAgICAgICA8cGF0aCBmaWxsPSIjODA5RUVEIiBkPSJNMzY5LjM3MiAxMTQuMzczbC0uNjk5IDIuODQ0IDEuOTU2IDIuMTg2LTIuOTE4LjIyLTEuNDc4IDIuNTI3LTEuMTEyLTIuNzA4LTIuODY0LS42MTUgMi4yMzgtMS44OTgtLjI5OC0yLjkxNCAyLjQ5MSAxLjU0MiAyLjY4NC0xLjE4NHpNMTE3LjIzMSA1NC41NGwtLjY5OSAyLjg0MyAxLjk1NyAyLjE4Ni0yLjkxOC4yMi0xLjQ3OSAyLjUyNy0xLjExMi0yLjcwOC0yLjg2NC0uNjE1IDIuMjM5LTEuODk4LS4yOTgtMi45MTQgMi40OSAxLjU0MiAyLjY4NC0xLjE4NHoiLz4KICAgICAgICAgICAgPHBhdGggZmlsbD0iIzk1OURBRSIgZD0iTTMzMC43ODggNzMuNjAyYy0uMzE4LjU1LTEuMDE2LjczNy0xLjU2Ny40Mi0uNTUtLjMxOC0uNzM3LTEuMDE2LS40MTktMS41NjcuMzE3LS41NSAxLjAxNi0uNzM3IDEuNTY2LS40Mi41NS4zMTguNzMzIDEuMDI0LjQyIDEuNTY3ek0xMTYuMDAxIDk2LjQ1Yy41NDguMzE3IDEuMjQ5LjEzIDEuNTY2LS40MTkuMzE3LS41NDguMTI5LTEuMjUtLjQxOS0xLjU2Ni0uNTQ5LS4zMTctMS4yNS0uMTI5LTEuNTY3LjQyLS4zMTcuNTQ4LS4xMjkgMS4yNS40MiAxLjU2NnpNNjMuNTQgMTQ1LjQzM2MuNTQ4LjMxNyAxLjI1LjEyOSAxLjU2Ni0uNDIuMzE2LS41NDguMTI5LTEuMjQ5LS40Mi0xLjU2Ni0uNTQ4LS4zMTYtMS4yNS0uMTI4LTEuNTY2LjQyLS4zMTcuNTQ4LS4xMyAxLjI0OS40MiAxLjU2NnpNMzI1LjE0NCAyOS4zNmMtLjMxOC41NS0xLjAxNi43MzgtMS41NjcuNDItLjU1LS4zMTctLjczNy0xLjAxNS0uNDE5LTEuNTY1LjMxNy0uNTUgMS4wMTYtLjczOCAxLjU2Ni0uNDIuNTQzLjMxMy43MzggMS4wMTYuNDIgMS41NjZ6TTE3Mi4wOTMgNjQuNjg1Yy0uMzE4LjU1LTEuMDE3LjczNy0xLjU2Ny40Mi0uNTUtLjMxOC0uNzM3LTEuMDE2LS40MTktMS41NjYuMzE3LS41NSAxLjAxNi0uNzM3IDEuNTY2LS40Mi41NS4zMTguNzM3IDEuMDE2LjQyIDEuNTY2ek00NTYuNDk3IDIzLjcyNGMtLjMxNy41NS0xLjAxNi43MzgtMS41NjYuNDItLjU1LS4zMTctLjczNy0xLjAxNi0uNDItMS41NjYuMzE4LS41NSAxLjAxNy0uNzM3IDEuNTY3LS40Mi41NS4zMTguNzM3IDEuMDE2LjQxOSAxLjU2NnpNMjM2LjcyNSAxNjEuNjE4Yy0uMzE4LjU1LTEuMDE2LjczNy0xLjU2Ny40Mi0uNTUtLjMxOC0uNzM3LTEuMDE2LS40MTktMS41NjYuMzE3LS41NSAxLjAxNi0uNzM3IDEuNTY2LS40Mi41NS4zMTguNzM4IDEuMDE2LjQyIDEuNTY2ek0yNS4zNjcgMTI4LjUyM2MtLjMxOC41NS0xLjAxNi43MzctMS41NjYuNDItLjU1LS4zMTgtLjczOC0xLjAxNi0uNDItMS41NjZzMS4wMTYtLjczOCAxLjU2Ni0uNDJjLjU1LjMxNy43MzggMS4wMTYuNDIgMS41NjZ6TTE1Ny4xODUgMTA0LjY4MmMuNTQ5LjMxNyAxLjI1LjEyOSAxLjU2Ny0uNDIuMzE2LS41NDguMTI4LTEuMjQ5LS40Mi0xLjU2Ni0uNTQ5LS4zMTYtMS4yNS0uMTI4LTEuNTY3LjQyLS4zMTYuNTQ4LS4xMjggMS4yNDkuNDIgMS41NjZ6TTIxMy45NzggMi4yNjdjLjU0OC4zMTYgMS4yNS4xMjggMS41NjYtLjQyLjMxNy0uNTQ4LjEyOS0xLjI1LS40MTktMS41NjYtLjU0OS0uMzE3LTEuMjUtLjEyOS0xLjU2Ny40Mi0uMzE2LjU0OC0uMTI4IDEuMjUuNDIgMS41NjZ6TTQzLjY5MiA1Mi41MjVjLS4zMTcuNTUtMS4wMTYuNzM3LTEuNTY2LjQyLS41NS0uMzE4LS43MzctMS4wMTctLjQyLTEuNTY3LjMxOC0uNTUgMS4wMTYtLjczNyAxLjU2Ny0uNDIuNTUuMzE4LjczNyAxLjAxNi40MiAxLjU2N3pNMjgzLjU4MiA1Ny43NzJjLjQ1LjQ0LjQ1OCAxLjE2OS4wMTcgMS42Mi0uNDQxLjQ1LTEuMTcuNDU3LTEuNjIuMDE2LS40NS0uNDQtLjQ1OC0xLjE2OS0uMDE3LTEuNjE5LjQ0MS0uNDUgMS4xNjktLjQ1OCAxLjYyLS4wMTd6TTExMy40MTcgMTQ0LjU5OGMuNDUuNDQxLjQ1OCAxLjE2OS4wMTcgMS42Mi0uNDQxLjQ1LTEuMTY5LjQ1OC0xLjYyLjAxNy0uNDUtLjQ0MS0uNDU4LTEuMTY5LS4wMTctMS42MTkuNDQ1LS40NTggMS4xNy0uNDU5IDEuNjItLjAxOHpNNDA0LjAwMyAxMTAuNjE0Yy40NTEuNDQxLjQ1OSAxLjE3LjAxOCAxLjYyLS40NDEuNDUtMS4xNy40NTgtMS42Mi4wMTctLjQ1LS40NDEtLjQ1OC0xLjE2OS0uMDE3LTEuNjE5LjQ0NS0uNDU4IDEuMTYyLS40NjMgMS42MTktLjAxOHpNMzUzLjI4NCAxNjkuNDc3Yy40NS40NDEuNDU4IDEuMTY5LjAxNyAxLjYxOS0uNDQxLjQ1MS0xLjE2OS40NTktMS42MTkuMDE4LS40NTEtLjQ0MS0uNDU5LTEuMTY5LS4wMTgtMS42Mi40NDEtLjQ1IDEuMTctLjQ1OCAxLjYyLS4wMTd6TTQyMy4wODUgNjIuMzM0Yy40NS40NC40NTggMS4xNjkuMDE3IDEuNjItLjQ0MS40NS0xLjE2OS40NTctMS42Mi4wMTctLjQ1LS40NDEtLjQ1OC0xLjE3LS4wMTctMS42Mi40NDEtLjQ1IDEuMTYzLS40NjIgMS42Mi0uMDE3eiIvPgogICAgICAgIDwvZz4KICAgICAgICA8cGF0aCBmaWxsPSIjODA5RUVEIiBkPSJNMjYzLjQzNCAxMDYuMDQzbC01OS4yMjIgMTkuMjY2Yy0zLjA2Ni45OTgtNi4zNTctLjY4NC03LjM1My0zLjc1OGwtNC44MDgtMTQuODY0Yy0uOTk2LTMuMDc0LjY4Mi02LjM3NCAzLjc0OS03LjM3Mmw1OS4yMjEtMTkuMjY1YzMuMDY3LS45OTggNi4zNTguNjg0IDcuMzUzIDMuNzU4bDQuODEyIDE0Ljg2NGMuOTkyIDMuMDc0LS42ODYgNi4zNzMtMy43NTIgNy4zNzF6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJFNUREQyIgZD0iTTI1NC45ODUgODIuMjdsLTU3Ljg1NyAxOC44MjRjLTMuNDQ0IDEuMTE4LTUuMzI2IDQuODI0LTQuMjEgOC4yNzdsMy43MiAxMS40OTZjMS4xMTYgMy40NTIgNC44MTMgNS4zMzkgOC4yNTYgNC4yMjFsNTcuODU3LTE4LjgyNGMzLjQ0NC0xLjExOCA1LjMyNi00LjgyNCA0LjIxMS04LjI3NmwtMy43MjEtMTEuNDk2Yy0xLjExNi0zLjQ1My00LjgxMy01LjM0LTguMjU2LTQuMjIxeiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyRTVEREMiIGQ9Ik0xOTIuMyAxMDcuNDYzcy0xNy4xMjcgMy42NTQtNC40NzYgMjcuNzA0bDMuNjA5LTYuMTk3cy00LjIxMS05LjE3OC0xLjEwOC0xMi4xODhjMy4xMDItMy4wMTMgNC4xMy0yLjY2MyA0LjEzLTIuNjYzbC0yLjE1NS02LjY1NnoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjc1LjMzIDEyMy44MzZsMTMuMzczIDU4Ljc5MS02MC42MjIgMTcuNjUzLTE1LjgwMi0zOC43MzMtMTEuOTI0LTM4LjY0IDYyLjU1My0yMS45MzQgMTIuNDIyIDIyLjg2M3oiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjQ0FDQUNBIiBkPSJNMjYyLjYyMiA4NC41ODRzMTYuMDAzLTcuMTI2IDE5Ljg1MiAxOS43ODlsLTYuNTUtMi44OTNzLTEuOTY3LTkuOTA2LTYuMjQ2LTEwLjUxOGMtNC4yNzQtLjYxMi00LjkwNC4yNzQtNC45MDQuMjc0bC0yLjE1Mi02LjY1MnoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTk4LjU2MSAxMDIuMTc2Yy0xLjg1OS01LjczOC0yLjA4Ny0xMS44ODItLjQ1LTE3LjM1NCAyLjExMS03LjA1NCA3LjI1My0xNS4zNzEgMTkuNTE5LTE5LjM2MyAxMC45MDUtMy41NDkgMTkuNTI2LjIwMSAyNS4yNDIgNC41NCA0LjU3NSAzLjQ3NiA4LjAzMSA4LjYwNiA5LjkwNSAxNC4zOTJsLjQxOCAxLjI5NmMxLjk0MiA2IDIuMDg3IDEyLjQyMS4yMzIgMTguMDc1LTIuMTY3IDYuNjE5LTcuMDA3IDE0LjE0Ny0xNy42OTYgMTcuNjI4LTEwLjc1MiAzLjUtMTkuNTY2LjMzOC0yNS42NDMtMy42MzQtNS4zMy0zLjQ4NC05LjQyOC05LjA4MS0xMS41MjctMTUuNTZ2LS4wMnoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjQjdCRkQxIiBkPSJNMjM1LjEyMSAxMjEuNTc5YzEuMjA0LTEuNTkgMi4wNjctMy4xMzEgMi40MjgtNC40NzkuNDg2LTEuODIzLjQ5NC00LjYyMy0uOTc5LTUuNjY1LTIuMDIzLTEuNDI5LTQuOTg1IDEuNzY2LTkuNTEzIDIuNzUyLTcuNDI5IDEuNjE4LTE1Ljg2Ni0zLjM5Ni0yMC4zOTctOS4yNjctNC45MzMtNi4zOS00Ljk4NS0xMy40NzEtNS4wMDUtMTUuOTgyLS4wNi04LjI0OSAzLjU0OC0xNC4yNDQgMi45ODYtMTQuNDgyLS41MDYtLjIxMy0zLjMxOSA0LjcyLTUuNTE5IDEwLjM0Ni0uODYzIDIuMi0xLjUyOSA0LjI1My0yLjA1NSA2LjEwOC0uMjEyIDMuNzM0LjMwMSA3LjU4NCAxLjQ5NyAxMS4yN2wuMDA0LjAxNmMyLjEgNi40NzggNi4xOTQgMTIuMDc2IDExLjUyOCAxNS41NiA1Ljk1NiAzLjg5MSAxNC41NDkgNy4wMDUgMjUuMDI1IDMuODIzeiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0yMDQuMTUyIDk4LjYyM2MtMS4yLTMuNzAyLTEuMTc2LTcuNzIyLjIwNS0xMS4zNTkgMS43ODItNC42ODggNS44NDgtMTAuMyAxNS4wNjMtMTMuMjk0IDguMTkyLTIuNjY0IDE0LjQ2MS0uNDggMTguNTYzIDIuMTg5IDMuMjg0IDIuMTM2IDUuNjg0IDUuMzkxIDYuODkyIDkuMTIxbC4yNjkuODM3YzEuMjUyIDMuODcxIDEuMTYgOC4wNzYtLjM4NiAxMS44MzgtMS44MSA0LjQwNi01LjYzMSA5LjQ5Mi0xMy42NTggMTIuMTA0LTguMDc2IDIuNjI3LTE0LjUwOS44MjktMTguODg4LTEuNTg2LTMuODQxLTIuMTE2LTYuNzAzLTUuNjU3LTguMDYtOS44Mzh2LS4wMTJ6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTI2MS45NjEgMTAwLjAxNXMtMy43NzMtMy42NDEtNS43MjQtNy43NjZsMi4xMzYgOS4yMDMgMy41ODgtMS40Mzd6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0I3QkZEMSIgZD0iTTI1Mi42MDQgOTEuNDg1Yy4zOSAxLjEwMy41NjYgMi4yNzMuNjI2IDMuNDQ1LjA2MSAxLjE3NC0uMDM2IDIuMzU3LS4yNiAzLjUyLS4yNDEgMS4xNjMtLjY2NyAyLjI5LTEuMjUzIDMuMzI0LS41ODIgMS4wMzgtMS40MTcgMS45MTktMi4zNDQgMi42MTEuNjc1LS45NTcgMS4yOTctMS44ODcgMS43MzgtMi45MjUuMDY0LS4xMjUuMTE3LS4yNTMuMTYxLS4zODZsLjE0OC0uMzkxYy4xMDUtLjI1Ny4yMDUtLjUxOS4yNzMtLjc5Mi4wNzItLjI3LjE3My0uNTMxLjIzNy0uODAxbC4xODUtLjgxN2MuMjI4LTEuMDk0LjM1Ny0yLjIxNy40MzctMy4zNDguMDY4LTEuMTMuMDg0LTIuMjczLjA1Mi0zLjQ0eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0yMDMuMzI1IDEwNy41MmMuNjU0Ljk2MSAxLjM0MSAxLjg3NSAyLjA1NSAyLjc1Mi43MjYuODY5IDEuNDg1IDEuNzAyIDIuMzEyIDIuNDUxbC42My41NTVjLjIxMy4xODEuNDQ1LjMzNC42NjIuNTA3LjIxMy4xODEuNDQ2LjMzNC42ODMuNDc5bC4zNDkuMjI5Yy4xMTIuMDguMjMzLjE1Ny4zNTcuMjE3Ljk2My41OCAyLjAxNS45NjYgMy4xMTkgMS4zNDQtMS4xNTYtLjAxMi0yLjM0OC0uMjM3LTMuNDI4LS43MzItMS4wOC0uNDg3LTIuMDg3LTEuMTUxLTIuOTYyLTEuOTUyLS44NjMtLjgwOC0xLjYzOC0xLjcxLTIuMjcyLTIuNjk2LS42My0uOTgxLTEuMTcyLTIuMDMyLTEuNTA1LTMuMTU0eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yNjMuNDgyIDEzMS4zOTNzMjQuOTg5LTkuODcxIDE5LjM0Ni0zNS40OTRjMCAwLTIyLjcxMy00LjQyMi0yOC4wNTYtMS40MjQgMCAwLTcuODY2IDI4LjEzOCA4LjcxIDM2LjkxOHoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjgyLjgyOCA5NS45czQuODY0LTI5LjE4NS43NzgtMzMuODQ5bC0yMi4zMDQtLjYzMnMtNy4xMTIgMjUuOTE4LTYuNTMgMzMuMDU2YzAgMCA5LjE2Ny0yLjYyOCAyOC4wNTYgMS40MjR6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0I3QkZEMSIgZD0iTTI4My42MDYgNjIuMDUxbC0xMi43MzEtLjM2MmMtMy4xNzEgMS41MzMtNi4wNDkgMy45MTEtNy45ODMgNi43MzYtMi45OTUgNC4zNjUtNS4wMzggMTEuNjc3LTIuMDM5IDE1LjQ4MyAyLjA5NSAyLjY2IDUuODMxIDIuNTYzIDUuODUyIDQuMDI0LjAzMiAyLjIwOS04LjQ3NyAzLjM0LTguMzg1IDUuMDEuMTA0IDEuODk5IDExLjIzNCAyLjcwOCAxMS4xOSAzLjY1My0uMDQuODI1LTguNDg1LS43MjgtMTIuNDc4IDMuNjA1LTMuMDMxIDMuMjg4LTIuMDg3IDguNDMtMS44NjcgMTEuMDk0IDEuNjg2IDIwLjU0NS0yNy44ODMgMzcuNTMtMjMuODE3IDQ0LjQ1NCAyLjcwOSA0LjYxMiAxNi4wNjMtMi41MTQgMjEuOTk1IDQuMDE2IDUuNTcxIDYuMTI4LTIuNjA1IDE2LjM1MyAxLjY2NiAyMi43MTQgMi4yMTUgMy4yOTYgNy41ODIgNS4yNzUgMTQuMzI0IDUuNzkxbDE5LjM3LTUuNjQyLTEzLjM3My01OC43OTEtLjIyNS0uNDE0YzUuNjExLTUuNjYyIDEwLjU3Mi0xNC41ODMgNy43MjItMjcuNTIzIDAgMCA0Ljg2MS0yOS4xOC43NzktMzMuODQ4em0tLjkxNSAzMy44MmMuMDI4LjAwOC4wNTYuMDEyLjA4OC4wMi0uMDI0LS4wMDgtLjA1Mi0uMDEyLS4wODgtLjAyem0tMi4zNjgtLjUwN2MuMDUyLjAxMi4xNDQuMDMyLjI3My4wNTZsLS4yNzMtLjA1NnptLjQwMS4wODRsLjI0NS4wNTMtLjI0NS0uMDUzem0uNTQyLjExN2MuMDIuMDA0LjA0NC4wMDguMDY4LjAxNi0uMDI0LS4wMDgtLjA0NC0uMDEyLS4wNjgtLjAxNnptLjQ3LjFjLjI3My4wNTcuNTg2LjEyNS45NTEuMjA2LS4xOTctLjA0NC0uNTYyLS4xMi0uOTUxLS4yMDV6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTIwMi4yMjkgMTE4Ljg2M3MyNC42NzYgMTYuMDQ3IDEzLjA1NiA0Mi4zMTRjMCAwLTI1LjMzNC0uMjEtMzAuNDE5LTQuNTkxLjAwNCAwLTIuMzMyLTMxLjkxNyAxNy4zNjMtMzcuNzIzeiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOTAuNzk4IDE5Ni45MDRzLTguODgyLTI3LjQ0Mi0zLjU2OC0zOS4wMTlsMjYuNTgyIDMuNTQ1czMuODUgMjQuNDEyIDIuMDIzIDMyLjAzN2MtLjAwNCAwLTMuOTIxIDIuMjQyLTI1LjAzNyAzLjQzN3pNMjE5LjQyIDczLjk3Yy0xNy42ODQgNS43NTQtMTYuNDA4IDIxLjEzNi0xNi40MDggMjEuMTM2bC40NzggMS40NzdzLTEuMjc2LTE1LjM4MyAxNi40MDgtMjEuMTM3YzE1LjU0NS01LjA1OCAyNC4xNzggNy4zNiAyNC4xNzggNy4zNmwtLjQ3OC0xLjQ3N2MtLjAwNCAwLTguNjM3LTEyLjQxNy0yNC4xNzgtNy4zNnoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMjMyQzNGIiBkPSJNMjAzLjAxMiA5NS4xMDJjLS4xNDQtNC42OTUgMS4zODktOS40NzIgNC4yNjctMTMuMjc0IDEuNDI4LTEuOTExIDMuMjA2LTMuNTQ1IDUuMTYxLTQuOTAxIDEuOTYzLTEuMzU2IDQuMTMtMi4zODIgNi4zNjItMy4xODcgMi4yMjctLjgyIDQuNTk1LTEuMzIgNi45OC0xLjQxMiAyLjM4OC0uMDc3IDQuNzk2LjI2NSA3LjAzOSAxLjA2NiAyLjI1Mi43ODUgNC4zMzkgMS45OCA2LjIxNCAzLjQxMiAxLjg2MiAxLjQ1MyAzLjU0OCAzLjExNSA1LjAyNSA0LjkzNy0xLjYyNi0xLjY4NS0zLjM2LTMuMjc1LTUuMjgyLTQuNTg3LTEuOTA3LTEuMzI4LTMuOTgyLTIuNDA2LTYuMTczLTMuMTEtMi4xOTYtLjY5Ni00LjUtMS4wMDYtNi43OTEtLjg4NS0yLjI5Mi4xMDQtNC41Ni42LTYuNzIzIDEuNC0yLjE4Ljc2NC00LjI3OSAxLjc2Mi02LjE5MyAzLjA0Mi0uOTU2LjY0NC0xLjg3NSAxLjM0NC0yLjcyNiAyLjEyLS44MzguNzg1LTEuNjUzIDEuNjEtMi4zNjQgMi41MTUtMS40MzMgMS44MDctMi41OTYgMy44NDMtMy4zOTkgNi4wMjQtLjgxOSAyLjE4LTEuMzEzIDQuNDk1LTEuMzk3IDYuODR6TTI0Ny4wMjkgOTAuOTFjLjM2OSA0LjY0My0xLjE0OCA5LjQ0My00LjEwMiAxMy4xMzMtLjczOC45MTgtMS41NDEgMS43OTUtMi40NCAyLjU2My0uMjE3LjIwMi0uNDQ2LjM5MS0uNjc0LjU3Mi0uMjMzLjE4NS0uNDU4LjM3NC0uNjk1LjU1MS0uNDg1LjMzNC0uOTUxLjcwNC0xLjQ1NyAxLjAwMi0xLjk5NCAxLjI2My00LjE1NCAyLjI0MS02LjM3NyAyLjk4Ni0yLjIzMi43MzYtNC41NjggMS4yMDctNi45MjggMS4yOTUtMi4zNTYuMDg1LTQuNzM2LS4xOTctNi45ODgtLjg4OS0yLjI1NS0uNjc2LTQuMzgzLTEuNzQ2LTYuMzAxLTMuMDktMS45MDctMS4zNi0zLjYyNC0yLjk2Ni01LjA4OS00Ljc2OCAzLjE4NiAzLjM2NyA3LjE2IDYuMDA3IDExLjU3NSA3LjIwMiA0LjQxMSAxLjIxOSA5LjEzOS44ODUgMTMuNDU0LS41ODMgMi4xNzUtLjcxNyA0LjI3NC0xLjY1NCA2LjIxMy0yLjg1NyAxLjk1LTEuMTgzIDMuNy0yLjY4NCA1LjE3Ny00LjQyMiAxLjQ3Ny0xLjczOSAyLjYyOS0zLjc1OCAzLjQyLTUuOTE1Ljc5NS0yLjE0OSAxLjIzNi00LjQ1OSAxLjIxMi02Ljc4eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMzguNTIgODEuODFjLjY1Ny0zLjA5LTIuMzUxLTYuMzUyLTYuNzE3LTcuMjg0LTQuMzY3LS45MzMtOC40MzkuODE3LTkuMDk2IDMuOTA4LS42NTYgMy4wOSAyLjM1MSA2LjM1MiA2LjcxOCA3LjI4NSA0LjM2Ni45MzIgOC40MzktLjgxOCA5LjA5NS0zLjkwOXoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjQjdCRkQxIiBkPSJNMjA1LjA4MyA3Ni4xNGMtLjMxMy0uMjAyLS4xNDgtMS4wMi4zNjUtMS44MzIuNTE0LS44MTMgMS4xODQtMS4zMDggMS40OTctMS4xMDcuMzEzLjIwMS4xNDkgMS4wMTgtLjM2NSAxLjgzMS0uNTE0LjgxLTEuMTg0IDEuMzA5LTEuNDk3IDEuMTA3ek0yMTQuMDkgNjguMDI3YzEuNjY1LTEuMDg2IDMuNTI0LTEuODY3IDUuNDM0LTIuNDQ3IDEuOTE1LS41NzUgMy45MDktLjkxMyA1LjkxNi0uOTk4IDEuMDA0LS4wMjQgMi4wMTEtLjAwOCAzLjAxNC4wOTcuOTk2LjEyNCAxLjk5NS4yNjUgMi45NjMuNTM5IDEuOTQyLjUgMy43OTYgMS4zMjggNS40NSAyLjQyMy0xLjgyNi0uNzczLTMuNjg4LTEuMzk3LTUuNjAzLTEuNzU1LTEuOTEtLjM2Mi0zLjg1My0uNTA3LTUuNzkyLS40MjYtMS45MzguMDY0LTMuODY5LjM1NC01Ljc3NS43OC0xLjg5OS40NDctMy43NzcgMS4wMjctNS42MDcgMS43ODd6TTI1MS43ODYgODYuNjEyYy4yMjkuMTgxLjM2NS4zOTUuNDg1LjYwOC4xMTMuMjE3LjE5My40NDcuMjQ1LjY4LjA1Mi4yMzQuMDc2LjQ3NS4wNjQuNzItLjAxNi4yNDYtLjA1Ni40OTYtLjE4NC43NTctLjIzMy0uMTk3LS4zNzMtLjQxLS40OS0uNjIzLS4xMTItLjIxOC0uMTkzLS40MzUtLjI0MS0uNjY1LS4wNDgtLjIyNS0uMDcyLS40NjItLjA2LS43MDQuMDE2LS4yNDEuMDU2LS40OTUuMTgxLS43NzN6TTI0MC4xMDYgNjkuNTI3YzEuMzM3LjcxMyAyLjU0MSAxLjY1OCAzLjY1NiAyLjY4IDEuMTIgMS4wMjYgMi4xNDQgMi4xNTcgMy4wNTkgMy4zNzIuMjM3LjI5OC40NDkuNjEyLjY2Mi45My4yMDkuMzE3LjQ0Mi42Mi42MzQuOTUuMzg2LjY1NS43OTEgMS4yOTkgMS4xMTIgMS45OS43MDIgMS4zNDkgMS4yMiAyLjc4NSAxLjYxMyA0LjI0Mi0uNzM0LTEuMzI4LTEuNDEyLTIuNjUyLTIuMjExLTMuOTA3LS43NzEtMS4yNzItMS42MTQtMi40OS0yLjUwNS0zLjY3NC0uODc5LTEuMTk1LTEuODQ2LTIuMzE3LTIuODQxLTMuNDItMS4wMDgtMS4wOTktMi4wNTUtMi4xNTctMy4xNzktMy4xNjN6TTE5NS43NTUgMTYwLjQ4OWMtLjIzNy4xMzMtLjQ1OC4xNzctLjY3NC4xOTctLjIxNy4wMTYtLjQyNiAwLS42My0uMDQ0LS4yMDUtLjA0NS0uNDAyLS4xMjEtLjU4Ni0uMjMtLjE4NS0uMTEyLS4zNjYtLjI0OS0uNTIyLS40NzEuMjQ1LS4xMzIuNDY5LS4xNzcuNjgyLS4xOTcuMjEzLS4wMTYuNDIyIDAgLjYxOC4wNDQuMjAxLjA0NS4zOS4xMjEuNTc4LjIzLjE4NS4xMTMuMzY5LjI0NS41MzQuNDcxek0yMTYuMDk2IDE2MC43NWMtMS40MjUuNDE5LTIuODg2LjY3My00LjM1NS44NTQtMS40NjkuMTg5LTIuOTQ2LjI3My00LjQyNy4yOTgtLjczOC4wMTItMS40ODEtLjAxMi0yLjIxOS0uMDI5LS43MzktLjA1Mi0xLjQ3Ny0uMDY4LTIuMjE2LS4xNjUtMS40NzMtLjEzNi0yLjkzOC0uMzk0LTQuMzcxLS43NTYgMS40ODUgMCAyLjk0Ni4wNjggNC40MTEuMDcyIDEuNDYxLjAyIDIuOTIyLjAyOCA0LjM4MyAwIDEuNDYxLS4wMDggMi45MjItLjA1NiA0LjM4My0uMWw0LjQxMS0uMTc0eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0yNjIuODE1IDk1Ljc1OGMtLjIzNy4xMzMtLjQ1OC4xNzgtLjY3NC4xOTgtLjIxNy4wMTYtLjQyNiAwLS42My0uMDQ0LS4yMDUtLjA0NS0uNDAyLS4xMjEtLjU4Ni0uMjMtLjE4NS0uMTEzLS4zNjYtLjI1LS41MjItLjQ3LjI0NS0uMTM0LjQ2OS0uMTc4LjY4Mi0uMTk4LjIxMy0uMDE2LjQyMiAwIC42MTguMDQ0LjIwMS4wNDQuMzkuMTIuNTc4LjIzLjE4OS4xMDguMzY5LjI0NS41MzQuNDd6TTI4My4xNTYgOTYuMDE2Yy0xLjQyNS40MTktMi44ODYuNjcyLTQuMzU1Ljg1My0xLjQ2OS4xOS0yLjk0Ni4yNzQtNC40MjcuMjk4LS43MzguMDEyLTEuNDgxLS4wMTItMi4yMTktLjAyOC0uNzM5LS4wNTItMS40NzctLjA2OC0yLjIxNi0uMTY1LTEuNDczLS4xMzctMi45MzgtLjM5NC00LjM3MS0uNzU3IDEuNDg1IDAgMi45NDYuMDY5IDQuNDExLjA3MyAxLjQ2MS4wMiAyLjkyMi4wMjggNC4zODMgMCAxLjQ2MS0uMDA4IDIuOTIyLS4wNTcgNC4zODMtLjFsNC40MTEtLjE3NHpNMjY2LjEzNSAxNDkuODU0Yy0uMTY5LjIxMy0uMzU3LjMzNC0uNTU0LjQzNS0uMTkzLjA5Ni0uMzkzLjE1Ny0uNjAyLjE5My0uMjA1LjAzMi0uNDE3LjAzNi0uNjMuMDA0LS4yMTctLjAzNi0uNDM0LS4wOTMtLjY1OC0uMjQ2LjE4LS4yMTMuMzY5LS4zMzguNTYyLS40MzkuMTkyLS4wOTYuMzg5LS4xNTYuNTktLjE4OS4yLS4wMzIuNDA5LS4wMzIuNjIyLS4wMDQuMjE2LjA0MS40MzMuMDk3LjY3LjI0NnpNMjc3LjA2IDE0Ni4wNTFjLTEuMzQ1LjU3Mi0yLjcwNiAxLjEwNy00LjA3IDEuNjM0LTEuMzYxLjUzOS0yLjc0NiAxLjAyMi00LjEyMiAxLjU3MyAxLjQ2NS0uMTk3IDIuOTIyLS40OTkgNC4zMzgtLjkyMS43MTktLjE4NSAxLjQxMy0uNDQ3IDIuMTE2LS42NzIuNjk0LS4yNTggMS4zODgtLjUxNSAyLjA3MS0uODAxLjk3MS0uNDA2IDEuOTMtLjg0OSAyLjg2OS0xLjMyOGwtLjE3Ni0uNzcyYy0xLjAwNC40MzgtMi4wMTEuODczLTMuMDI2IDEuMjg3eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNCN0JGRDEiIGQ9Ik0yMDIuMjMgMTE4Ljg2M3M1LjQxNC0zLjY2MiAxMC41MjgtMS41NzRsLjc5NCAyLjQ1MS04LjE2IDMuNTI5LTMuMTYyLTQuNDA2eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0yMDYuMzU5IDExOC44NzljMS45OTkuNzk2IDQuMTM0IDEuMDkgNi4yNDkgMS4yNTEgMS4wNi4wODUgMi4xMjQuMTA5IDMuMTg3LjEwMWwxLjU5NC0uMDMyIDEuNTg5LS4wOTdjLjUzLS4wMjQgMS4wNi0uMDg5IDEuNTg5LS4xNDEuNTMtLjA2IDEuMDYtLjA5NiAxLjU4Ni0uMTY1bDEuNTgxLS4yMjFjLjUyNi0uMDY5IDEuMDUyLS4xNDkgMS41NzQtLjI1NCAxLjA0My0uMjAxIDIuMDk5LS4zNDYgMy4xMzgtLjU5MSAxLjA0LS4yMjkgMi4wOTEtLjQyNyAzLjEwNy0uNzI0IDEuMDIzLS4yNzQgMi4wNTktLjUwMyAzLjA1NC0uODY2bDEuNTA5LS40OThjLjUwMi0uMTY1Ljk4NC0uMzkxIDEuNDc3LS41NzYgMS45OTEtLjczMiAzLjg1NC0xLjczOCA1LjY5Ni0yLjc3NiAxLjgwNi0xLjA5OSAzLjUyNC0yLjM1IDUuMDg5LTMuNzg3IDEuNTYxLTEuNDMyIDMuMDA2LTMuMDM0IDQuMDk4LTQuODg4LS44MzkgMS45OTUtMi4xNzUgMy43NTQtMy42NDQgNS4zNTEtMS40OTcgMS41ODEtMy4xODMgMi45ODYtNC45OTcgNC4xOTctMy42NDkgMi40MDYtNy43NTUgNC4wNDgtMTEuOTYxIDUuMTIyLTQuMjEgMS4wMjYtOC41MDEgMS43NDYtMTIuODQ0IDEuODQ3LTIuMTY3LjA4MS00LjM0My0uMDUyLTYuNDktLjM1OC0xLjA3MS0uMTU3LTIuMTM1LS4zODYtMy4xNzktLjY3Ni0xLjAzOS0uMzEtMi4wNzEtLjY3Mi0zLjAwMi0xLjIxOXoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjA4Ljk1NyAxMDEuMDc4cy44ODcgMS42ODIgMy40NzkgMi41ODhsLTMuNDc5LTIuNTg4ek0yMTAuNTA2IDEwMC45MzNzLjg4NyAxLjY4MiAzLjQ4IDIuNTg4bC0zLjQ4LTIuNTg4ek0yMTMuMjIzIDEwMS4xNTRzLjU5OCAxLjEzNSAyLjM1MiAxLjc0N2wtMi4zNTItMS43NDd6TTI0Mi4xNjkgOTIuMzc1czEuNTA5LTEuMTUgMS45NzQtMy44NjdsLTEuOTc0IDMuODY3ek0yNDEuNzcxIDkwLjg3czEuNTEtMS4xNTEgMS45NzUtMy44NjdsLTEuOTc1IDMuODY3ek0yNDEuNTQzIDg4LjE0NnMxLjAxOS0uNzc3IDEuMzMyLTIuNjE2bC0xLjMzMiAyLjYxNnoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjQjdCRkQxIiBkPSJNMjAyLjcxNSA5Ny4wNjZjLS43NDItMy40NjUtLjUyNi0xMC4yOTMgNC42NDQtMTYuNzg3IDIuOTk4LTMuNzcgNS4xNTQtNS43MTggMTQuMTA0LTkuMjA3LjEyOC0uMDQ4LTEyLjE2MSAyLjUyNy0xNy44MjEgMTEuNDcyLTUuMzUgOC40NS0uODY3IDE0LjgwNC0uOTI3IDE0LjUyMnoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMjMyQzNGIiBkPSJNMjM0LjcyNyA3MS4yNzRjLjM0NS0uMDc3LjY2My0uMDU3Ljk3Ni0uMDE2LjMwOS4wNDguNjA2LjEzNi44ODcuMjU3LjI4NS4xMjEuNTUuMjc0LjgwMi40Ni4yNDkuMTkyLjQ4Mi40MS42NjcuNzEyLS4zNTQuMDI4LS42NTktLjAyLS45Ni0uMDg1LS4yOTctLjA2OS0uNTc4LS4xNjEtLjg1MS0uMjc4LS4yNzItLjExNy0uNTM3LS4yNTMtLjc5LS40MjItLjI1My0uMTctLjUwMi0uMzU1LS43MzEtLjYyOHpNMjA0LjA1NSA4MS45NTNjMS4zOTctMi4yMTcgMy4xOTktNC4xOTMgNS4yNjItNS44MzkgMi4wNjMtMS42NTMgNC4zNzktMi45ODEgNi44MDctNC4wMTUgMi40MjgtMS4wMjIgNC45NzMtMS44NDMgNy42MS0yLjE1NyAyLjYyNS0uMzM4IDUuMzE4LS4xODEgNy44NDcuNTAzLTIuNjA1LS4yNzQtNS4yMDItLjE5LTcuNzM1LjI1LS42MzQuMS0xLjI2NC4yMzctMS44ODYuMzktLjYyNi4xNDUtMS4yNDguMzE0LTEuODYyLjQ5OS0xLjIyOS4zODItMi40NDkuODEyLTMuNjQxIDEuMy0yLjM4Ljk5LTQuNjcyIDIuMjA0LTYuNzYzIDMuNzI1LTIuMDk5IDEuNTA1LTQuMDA2IDMuMy01LjYzOSA1LjM0NHpNMjE1LjE4OSAxMTQuMDI3Yy0uMzQ1LjA3Ni0uNjYyLjA1Ni0uOTc1LjAxNi0uMzA5LS4wNDktLjYwNi0uMTM3LS44ODctLjI1OHMtLjU1LS4yNzQtLjgwMy0uNDU5Yy0uMjQ5LS4xOTMtLjQ4Mi0uNDEtLjY2Ni0uNzEyLjM1My0uMDI4LjY1OC4wMi45NTkuMDg0LjI5Ny4wNjkuNTc4LjE2MS44NTEuMjc4LjI3My4xMTcuNTM4LjI1NC43OTEuNDIzLjI1Mi4xNjkuNTAxLjM1NC43My42Mjh6TTI0NS44NTcgMTAzLjM0N2MtMS4zOTcgMi4yMTctMy4xOTkgNC4xOTMtNS4yNjYgNS44MzktMi4wNjMgMS42NTMtNC4zNzkgMi45ODEtNi44MDcgNC4wMTUtMi40MjggMS4wMjItNC45NzMgMS44NDMtNy42MSAyLjE1Ny0yLjYyNS4zMzgtNS4zMTguMTgxLTcuODQ3LS41MDMgMi42MDUuMjc0IDUuMjAyLjE4OSA3LjczNS0uMjQ5LjYzNC0uMTAxIDEuMjY0LS4yMzggMS44ODYtLjM5MS42MjYtLjE0NSAxLjI0OC0uMzE0IDEuODYyLS40OTkgMS4yMjktLjM4MiAyLjQ0OS0uODEyIDMuNjQxLTEuMjk5IDIuMzgtLjk5IDQuNjcyLTIuMjA1IDYuNzYzLTMuNzI2IDIuMTA3LTEuNTA1IDQuMDEtMy4zIDUuNjQzLTUuMzQ0eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMjIuMjg1IDgyLjgyNmMuMzQ2LjM5LjcwMy43NiAxLjA5MiAxLjA5NC4xODkuMTc3LjM4OS4zMzQuNTgyLjUwM2wuNjE0LjQ2M2MuODM1LjU4OCAxLjczIDEuMDgzIDIuNjc3IDEuNDM3Ljk0NC4zNjYgMS45MzkuNiAyLjk1NC42NzYgMS4wMTYuMTE2IDIuMDM5IDAgMy4wNzEtLjEwNS0uMjQ5LjA2OC0uNTAyLjEzMy0uNzU1LjE5My0uMjUzLjA1Ni0uNTA1LjE0LS43NjYuMTU3LS41MTguMDUyLTEuMDQ0LjEyNS0xLjU3LjA5My0uNTMuMDItMS4wNDctLjA4NS0xLjU3My0uMTU3LS4yNjEtLjA0OS0uNTEtLjEzMy0uNzY3LS4xOTgtLjI1Ny0uMDYtLjUwNS0uMTUzLS43NS0uMjQ5LS45ODQtLjM3OC0xLjkxNS0uOTA1LTIuNzI2LTEuNTc3LS44MDYtLjY2OC0xLjUzNy0xLjQ0LTIuMDgzLTIuMzN6TTE5Ny45NjMgOTIuOTQyYy4wNjQuNjMxLjEzNiAxLjI1NS4yMzIgMS44NzkuMDg5LjYyMy4xODUgMS4yNDcuMzAxIDEuODYzLjIyOSAxLjIzNS40ODYgMi40NjYuODA3IDMuNjgxLjMwNSAxLjIyLjY3NCAyLjQxOSAxLjA4NCAzLjYxLjEwNC4yOTguMi41OTUuMzEzLjg4OWwuMzQ1Ljg3N2MuMjA5LjU5Ni40OTQgMS4xNTkuNzE4IDEuNzUxLS42NDYtMS4wODctMS4yMjgtMi4yMjItMS42OTMtMy40MDEtLjI2MS0uNTc5LS40NDItMS4xOTEtLjY2My0xLjc4Ni0uMTgtLjYwOC0uMzc3LTEuMjE1LS41MjktMS44MzEtLjMxMy0xLjIzMS0uNTY2LTIuNDc4LS43MTUtMy43NDItLjE1Ni0xLjI1NS0uMjUzLTIuNTIzLS4yLTMuNzl6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0I3QkZEMSIgZD0iTTIyMy42OTggMTc5Ljg5NWMtLjQyNS0xLjc3IDE4LjU1NS04LjA1MSAxOC4zMzUtOC42OTktLjIyOS0uNjY0LTIwLjIyOSA1LjczOC0yMS4xNjQgMy40NjQtLjM1LS44NDEgMi4zMjQtMS45MzUgMi4yOTEtNC4xNjQtLjA0NC0zLjA1OC01LjcwMy0zLjM0NC02LjQ0MS03LjI1MS0uNzcxLTQuMDg0IDMuMDU0LTYuNDIyIDIuNTQ4LTExLjA5LS41ODYtNS40MDgtNy41MDktMTAuODQ0LTEwLjU5Ni05LjU0OC0uNjQyLjI2OS0xLjIxMi44NzMtMS42OTggMS43NDZsNS4zMDYgMTcuMTk0IDExLjczNiAyOC43NjZjMTAuNjMzLjE4OSAyMi42MjktMTAuMTggMjEuNzk1LTEyLjM2NS0xLTIuNjI0LTIxLjczIDMuNTItMjIuMTEyIDEuOTQ3ek0yMDguMTY5IDEyOC40MDdjLjUyMi0uNDAyLjI0NS0yLjA0OC0xLjg5OC02LjI5My0yLjMyLTIuMTMzLTQuMDQyLTMuMjUxLTQuMDQyLTMuMjUxLTE5LjY5NSA1LjgwNi0xNy4zNTkgMzcuNzIzLTE3LjM1OSAzNy43MjMuNTYyLjQ4MiAxLjM2NC45MTMgMi4zNTYgMS4yOTktNS4zMTQgMTEuNTc3IDMuNTY4IDM5LjAxOSAzLjU2OCAzOS4wMTkgNC4yMTgtLjIzOCA3Ljc0Mi0uNTE5IDEwLjY5Mi0uODE3LjY4Ny0yLjE2OS43OTEtNC4zMDItLjE3Mi01Ljk0Ny0yLjUxNy00LjMxNC0xMS4wOS0zLjI1MS0xMS4xNzgtNS4wMjYtLjA4NS0xLjY1IDcuMzA5LTIuNzk2IDcuMjE2LTQuNDAyLS4xMDQtMS43NzgtOS4zMDctMi4xODEtOS4zNDQtMy41NzMtLjA0NC0xLjYzOCAxMi42ODgtMi4zOSAxMi45LTUuMTEuMTY5LTIuMTMzLTcuNjIyLTIuMzM0LTExLjQyMi04LjU5NS0xLjAyOC0xLjY5NC0xLjQ2MS00LjIyMS0yLjMyLTkuMjc1LTEuMDg0LTYuMzY1LTEuNTk4LTkuNTc2LS4xMjEtMTAuOTA0IDIuNzM4LTIuNDU5IDkuODkgMS43NDYgMTAuMjU1Ljc2OC41ODYtMS41NzMtOC41ODEtNi4wMjctNy44NzUtNy40NjguNjk5LTEuNDI4IDguMDY4LjYzMiA4LjIwOC4wNjUuMTEzLS40NTktNC45ODEtLjk3NC01Ljk4OC0zLjc1LTEuMDItMi44MDkgMi4xOTktNy43ODIgNi4wODktOC41OTEgNC45NTItMS4wMzQgOS4yNjMgNS4wMzQgMTAuNDM1IDQuMTI4eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0yMDQuOTg3IDEyMC43MThzLTEuNjU3LS45MTgtNC4zMjYtLjI1bDQuMzI2LjI1ek0yMDMuNzcxIDEyMS42OTJzLTEuNjU4LS45MTgtNC4zMjctLjI1bDQuMzI3LjI1ek0yMDEuMzc5IDEyM3MtMS4xMi0uNjItMi45MjItLjE2OWwyLjkyMi4xNjl6TTI4Mi4wMjkgNjUuODlzLTEuNjU3LS45MTgtNC4zMjYtLjI1bDQuMzI2LjI1ek0yODAuODEzIDY2Ljg2NHMtMS42NTgtLjkxOC00LjMyNy0uMjVsNC4zMjcuMjV6TTI3OC40MjEgNjguMTcycy0xLjEyLS42Mi0yLjkyMi0uMTdsMi45MjIuMTd6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iI0I3QkZEMSIgZD0iTTE5Mi42MyAxNDQuNTYycy0xLjgxMS0uNTU5LTQuMjg3LjY0bDQuMjg3LS42NHpNMTkxLjYzNCAxNDUuNzY2cy0xLjgxLS41Ni00LjI4Ny42NGw0LjI4Ny0uNjR6TTE4OS41NTkgMTQ3LjUzM3MtMS4yMjUtLjM3OS0yLjg5NC40MzRsMi44OTQtLjQzNHoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMkU1RERDIiBkPSJNMjU5LjUyMSAyMy4zMjZsLTYuNjY3LTEzLjQzcy0xLjI4LTIuNjU3LTMuMzcxLTEuNTgyYy0yLjA5MSAxLjA3NC0xLjExMiAzLjcxOC0xLjExMiAzLjcxOGw2LjcxMSAxNi45NzJzLTEuMzUzIDIuMTU3LS44OTkgMy4zODRjLjQ1MyAxLjIyNyA1LjMwMiA3LjkzIDcuMzc3IDguMTcyIDIuMDc1LjI0MiA5LjIyMyAyLjc4NSAxNi4yMjctMS4yMTlsLTEuMDM2LTIuNzg4czMuMzQtNS42OSAyLjk1OS04LjA4NGMtLjM4Mi0yLjM5OC0zLjE0My04LjQ4Mi0zLjE0My04LjQ4MmwtLjYzNC0xMC45MzdzLjMwMS0zLjI4Ny0yLjM0LTMuNTczYy0yLjY0MS0uMjg2LTIuNDg1IDMuMjExLTIuNDg1IDMuMjExbC4wODUgOS4xMTQtMTEuNjcyIDUuNTI0eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0yNjAuMjY0IDM0Ljc4MmMuNTIyLjIwNSAyLjM2OC0xLjk0IDMuMDk0LTIuMjMzLjg4Ny0uMzU4IDEuMDM2LTEuMTcxIDEuODc5LTIuMTA4IDEuMDMxLTEuMTQzIDEuNTYxLS43NTcgMi45MTQtMS44MDMgMi4xNTEtMS42NjYgMi44MDEtNC4xODkgMi45NjItNC44MTMuMzEzLTEuMjE1LjMyMS0yLjI2NS4yODEtMi45NTMgMCAwIDEuMTgtLjU3MSAyLjMwOC0uNzUzIDEuMTMxLS4xOCAxLjA0Ny0uMzE3IDEuMDQ3LS4zMTdzLTIuMTQzLS40OTEtNC43NTYuMjE3bC04LjMgOC41MjYtMS40MjkgNi4yMzd6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJFNUREQyIgZD0iTTI2NS4yODYgMTguMjZzLTUuMDY5LTEuODAyLTYuMDQxIDEuMTU1Yy0uOTY3IDIuOTU4LjI0OSA5LjU1NyAxLjcyMiA5Ljc3IDEuNDczLjIxMyAzLjgyMS0uMjgyIDMuMzYtMi45MDEtLjQ2Ni0yLjYyLS40My00LjU5MS0uNDMtNC41OTFzLjY2Ni4wNDQgMS4wMzYuNDM0Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzIzMkMzRiIgZD0iTTI2NS4yODUgMTguMjY1Yy0xLjA4NC0uMzAyLTIuMjEyLS41MDctMy4zMjQtLjQzNS0uNTUuMDM2LTEuMTAzLjE0OS0xLjU3My40MS0uNDc4LjI1NC0uODE1LjY5Ny0uOTc1IDEuMjA0LS4zMTMgMS4wNS0uMzQ1IDIuMTg5LS4zMDUgMy4zMDMuMDUyIDEuMTE5LjIgMi4yMzcuNDUzIDMuMzI0LjEzMy41NDMuMjc3IDEuMDgyLjQ3NCAxLjU5Ny4xLjI1OC4yMTMuNTA3LjM0OS43MzYuMTMyLjIyNi4zMDEuNDQzLjQ4Mi41NDQuMDQ0LjAyNC4wODguMDM2LjEzMi4wNDhsLjIwMS4wMjRjLjEzMi4wMTIuMjY5LjAyLjQwNS4wMi4yNjkgMCAuNTQyLS4wMjQuODAzLS4wNzYuNTIyLS4xMDUgMS4wMjctLjMzNCAxLjM2LS43MjQuMzQ2LS4zODMuNDgyLS45MjYuNDU4LTEuNDYxLS4wMDgtLjI3LS4wNi0uNTQtLjEtLjgyNS0uMDQtLjI4Mi0uMDgxLS41NjMtLjExMy0uODQ1LS4xMzYtMS4xMy0uMTg4LTIuMjctLjE2LTMuNDA0di0uMDQ0bC4wNC4wMDRjLjM4MS4wNTIuNzcxLjE4OSAxLjAzMS40NzUtLjI4MS0uMjY2LS42Ny0uMzY3LTEuMDM1LS4zOTlsLjA0NC0uMDRjLjAyOCAxLjEzLjE2NSAyLjI1My4zMjUgMy4zNjguMDQuMjc3LjA4OC41NTUuMTQxLjgzMy4wNDguMjczLjExMi41NTkuMTMyLjg1Ny4wNDQuNTgzLS4wODQgMS4yMzEtLjQ4NiAxLjcxNC0uMzk3LjQ4My0uOTg3Ljc0NC0xLjU2MS44NjktLjI4OS4wNi0uNTg2LjA5My0uODc5LjA5My0uMTQ4IDAtLjI5My0uMDA1LS40NDEtLjAxNmwtLjIyMS0uMDI1Yy0uMDkyLS4wMTYtLjE4OS0uMDQ0LS4yNjUtLjA4OC0uMzEzLS4xNzctLjQ5LS40MzktLjY1LS42OTItLjE1Ny0uMjU4LS4yNzctLjUyMy0uMzg2LS43OTMtLjIxNi0uNTQtLjM3Ny0xLjA5NC0uNTAxLTEuNjU0LS4yNDktMS4xMjItLjM4Ni0yLjI2MS0uNDI2LTMuNDA0LS4wMjQtMS4xNDMuMDA4LTIuMzEuMzktMy40MjQuMi0uNTY3LjYxOC0xLjA3IDEuMTU2LTEuMzMyLjUyOS0uMjc0IDEuMTE5LS4zNyAxLjY5My0uMzgyIDEuMTQ4LS4wMDQgMi4yNzIuMjQ1IDMuMzMyLjY0eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyRTVEREMiIGQ9Ik0yNzQuNzI0IDE5LjgwNnMtMS4wNzUtLjUxMS00LjczMi4yMTdjMCAwLS4wMzYgMi4yOTcuNDMgNC45MjEuNDY1IDIuNjItMS44ODcgMy4xMTQtMy4zNiAyLjkwMS0xLjQ3My0uMjEzLTIuNjg5LTYuODEyLTEuNzIyLTkuNzcuOTY4LTIuOTU3IDUuODQ0LTEuMjEgNS44NDQtMS4yMSIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0yNzQuNzIzIDE5LjgwNmMtLjM4MS0uMTIxLS43ODItLjEzLTEuMTgtLjEzMy0uMzk3IDAtLjc5LjAyNC0xLjE4OC4wNjgtLjc5LjA4LTEuNTY5LjIzOC0yLjM0NC4zOTlsLjA5Ny0uMTE3Yy4wMTYgMS4xMy4xMDggMi4yNjUuMjU2IDMuMzg0LjA3My41NjcuMTc3IDEuMTA2LjI2MSAxLjY4Ni4wODUuNTgzLjAzNiAxLjIzMS0uMjg5IDEuNzc4LS4zMjUuNTQ0LS44OTUuODk0LTEuNDY5IDEuMDU5LS41NzguMTY5LTEuMTguMjA1LTEuNzc0LjEzMi0uMDY0IDAtLjE3Ni0uMDMyLS4yNjEtLjA2NC0uMDgtLjA0NC0uMTY4LS4wOC0uMjI4LS4xMzctLjE0MS0uMTA0LS4yNDEtLjIyNS0uMzMzLS4zNS0uMTg1LS4yNS0uMzE4LS41MTktLjQzOC0uNzg0LS4yMjktLjU0NC0uMzk3LTEuMDk5LS41MzQtMS42NTgtLjI2OS0xLjEyMy0uNDIxLTIuMjY2LS40NzctMy40MTYtLjA0OS0xLjE0Ny0uMDA0LTIuMzE0LjMxNy0zLjQ0LjE1Mi0uNTY4LjUwNS0xLjExNSAxLjAxMS0xLjQ0MS41MDYtLjMyNiAxLjA5Ni0uNDYzIDEuNjctLjQ5NSAxLjE1Ni0uMDQ5IDIuMjkyLjE5NyAzLjM1NS41ODctMS4wODctLjMxLTIuMjI3LS41MDctMy4zNDMtLjQwMi0uNTU0LjA2LTEuMS4yMS0xLjU0NS41MTUtLjQ0Ni4zMS0uNzM1Ljc4NS0uODYzIDEuMzE2LS4yNzcgMS4wNzQtLjI3NyAyLjIxNy0uMjI1IDMuMzQuMDY0IDEuMTIyLjIyOSAyLjI0NS40OTggMy4zMzUuMTM2LjU0My4zMDUgMS4wNzkuNTI1IDEuNTg1LjExMy4yNS4yNDEuNDkxLjM5NC43LjE1Ni4yMDYuMzIxLjM4My41My4zODcuNTMzLjA3MiAxLjA4Ny4wNDQgMS42MDEtLjEwNS41MS0uMTQuOTc5LS40MzQgMS4yNDgtLjg2OS41Ny0uOTA1LjA4OS0yLjA4NC4wMjgtMy4yMTUtLjExNi0xLjEzOS0uMTc2LTIuMjgxLS4xNTYtMy40Mjh2LS4wOTdsLjA5Ni0uMDE2Yy43ODctLjE0NSAxLjU4MS0uMjUgMi4zOC0uMjk3LjM5OC0uMDI1Ljc5OS0uMDI5IDEuMi0uMDEzLjQwMi4wMi44MDcuMDYgMS4xOC4yMDZ6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJFNUREQyIgZD0iTTI1NS4wODEgMjkuMDA0czcuMTY1LTkuNzM4IDkuOTgyLTYuNzQ0YzIuODE4IDIuOTk0LjAxNiA0LjY3Mi0yLjUyOCA2IDAgMC0uODU1IDQuMTgtMi4yNjggNi41MjIiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMjMyQzNGIiBkPSJNMjU1LjA4MSAyOS4wMDRjMS4wMTYtMS40NDkgMi4xMjctMi44MzMgMy4zNTUtNC4xMTYuNjE1LS42NDQgMS4yNTctMS4yNTYgMS45NTEtMS44MjMuNjk4LS41NTUgMS40NTMtMS4wNjcgMi4zMi0xLjM4NC40MjktLjE1Ny45MTUtLjI0MiAxLjQwMS0uMTYxLjQ4OS4wNzIuOTM1LjM4MiAxLjIyOC43MzYuMzA1LjMzOC41OS43MDQuNzk1IDEuMTI3LjIyNC40MS4zMjUuOTA1LjMwNSAxLjM4OC0uMDM2LjQ5NS0uMjYxLjk0MS0uNTM0IDEuMzItLjI3Ny4zODItLjYzNC42NzYtLjk4Ny45NjEtLjcyNy41NC0xLjUxNC45NjYtMi4zMDggMS4zNmwuMDg0LS4xMTJjLS4yNjUgMS4xMzQtLjU4NiAyLjI0OS0uOTY3IDMuMzQzLS4zOTggMS4wODctLjgzOSAyLjE3My0xLjQ2NSAzLjE0Ny41NDItMS4wMjIuOTM1LTIuMTA4IDEuMjY0LTMuMjEuMzMzLTEuMTAzLjYxOC0yLjIyMi44MzktMy4zNDVsLjAxNi0uMDc2LjA3Mi0uMDRjLjc3MS0uNDI3IDEuNTM3LS44NSAyLjIyOC0xLjM3Mi42NjYtLjUyMyAxLjI4LTEuMTk1IDEuMzQtMiAuMDQtLjgwNS0uNDQxLTEuNTY2LTEuMDAzLTIuMTk3LS4yNjktLjMyNi0uNTktLjU0My0uOTc5LS42MTItLjM4Ni0uMDY4LS44MDMtLjAwOC0xLjIwMS4xMzMtLjc5OC4yNzgtMS41MzMuNzY0LTIuMjIzIDEuMjk2LS42OTQuNTI3LTEuMzUzIDEuMTE0LTEuOTgzIDEuNzI2LTEuMjQ4IDEuMjIzLTIuNDMyIDIuNTM5LTMuNTQ4IDMuOTF6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzJFNUREQyIgZD0iTTI1OC45NzEgNjEuNzgybDI1Ljk1Ni40NjYtNy4xNC0yMi45MDctMTYuMjI3IDEuMjJzMi40MDQgNy45MTgtMi41ODkgMjEuMjJ6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzIzMkMzRiIgZD0iTTI3NC42ODMgMTIyLjk5NmMtLjk1OS0uMTI5LTEuOTMtLjEyOS0yLjg5NC0uMjU4LS45NTktLjEzMy0xLjkxLS4zMjYtMi44NDUtLjU5Mi0uOTMyLS4yNjktMS44MzUtLjYzNi0yLjcwNi0xLjA5OGwtLjA0OC4wNzJjLjc5OS41ODQgMS42OSAxLjA0NyAyLjYwOSAxLjQ0MS45MzEuMzU4IDEuODkxLjY0NCAyLjg2Ni44NjkuOTc1LjIxIDEuOTU4LjQzOSAyLjk1OC40NDMuMjM3IDAgLjQ3My0uMDA0LjcwNi0uMDEybC0uMDA0LS4wMjQtLjIyNC0uNDE1Yy4xMDgtLjEwOC4yMTItLjIyMS4zMjEtLjMzLS4yNDUtLjAzNi0uNDktLjA2NC0uNzM5LS4wOTZ6TTI1NC41NDcgMTYuMTA4Yy4zNjEtLjIwOS43MDItLjQ1OCAxLjAyNy0uNzI0bC0uMTM2LS4yNzhjLS4yOTMuMzM0LS41OTQuNjU2LS45MTkuOTY2bC4wMjguMDM2ek0yNTMuNzYxIDE1LjM5NmwuMDE2LjA0Yy41MTgtLjE2IDEuMDUxLS4yODIgMS41NjktLjUxMWwtLjE1Ni0uMzE0Yy0uNDQyLjI4Mi0uOTUyLjUwMy0xLjQyOS43ODV6Ii8+CiAgICAgICAgPHBhdGggZmlsbD0iIzgwOUVFRCIgZD0iTTI0OC43MTkgMTIuNDQ2Yy0uNDA1LTEuMTk1LS4wMi0yLjc1Mi44NzktMy4wMjIuNzgzLS4yMzcgMS41OS42MTIgMS42OTguNzI5IDEuMDA4IDEuMDg2IDEuMzk3IDMuMjQzLjY4NyAzLjk2Ny0uNzQ3Ljc1Ny0yLjcxLS4wNDgtMy4yNjQtMS42NzR6TTI0OS40NTggMTQuMzFzLjQ0Ni41ODMgMS4xNDQuNTAybC0xLjE0NC0uNTAzek0yNTEuMDc2IDkuMjJjLjIyNS4xLjQyMS4yNDkuNjA2LjQxLjE4NS4xNi4zNDUuMzU0LjQ4Mi41Ni4xMjguMjEzLjIzNi40NDIuMjg5LjY5Mi4wNTIuMjQ1LjA0NC41MDMtLjAyNC43MzYtLjAyNS0uMjQ1LS4wNjEtLjQ3NS0uMTM3LS42OTItLjA4NC0uMjE4LS4xODUtLjQyMy0uMzA5LS42MTYtLjI1My0uMzktLjU2Ni0uNzQtLjkwNy0xLjA5ek0yNzEuNzMgOC40MDdjLjA1Mi0xLjEwMy44NjMtMi4yNDYgMS42ODItMi4xNzcuNzE0LjA2IDEuMDk1IDEuMDA2IDEuMTQ3IDEuMTM4LjQ3NCAxLjIwOC4xMDUgMy4wOS0uNzA2IDMuNDQ5LS44NTEuMzctMi4xOTEtLjkxNC0yLjEyMy0yLjQxek0yNzEuNzM4IDEwLjE1N3MuMTc3LjYxNi43NzEuNzc3bC0uNzcxLS43Nzd6TTI3NC42NzYgNi41MzZjLjE1My4xNTMuMjY5LjMzNC4zNjkuNTIzLjEwMS4xODkuMTczLjM5OC4yMTcuNjEyLjA0LjIxNy4wNDguNDM4LjAxMi42NTYtLjA0LjIxNy0uMTMyLjQyNi0uMjY1LjU5MS4wNTItLjIwOS4wOTYtLjQwNi4xMDEtLjYwNy0uMDA1LS4yMDItLjAyMS0uMzk5LS4wNTctLjYtLjA4LS4zOTUtLjIyLS43NzctLjM3Ny0xLjE3NXpNMjU0LjgxMiAzMi4yOTFjLjM0NiAxLjA1NSAxLjM4NSAyLjE5NCAyLjUzNyAyLjE2MSAyLjA3NS0uMDYgNC4zMzEtMy45MzEgMy40MzItNi43MDctLjE0NS0uNDQ3LS41MDYtMS41NjYtMS4zNjktMS43NDMtMS43OTgtLjM2Ni01LjU1MSAzLjM5Ni00LjYgNi4yOXpNMjYwLjkwMSAyMS41OTdjLS41My4wNzMtMS4wNDQtLjI4Ni0xLjEtLjgxNy0uMDgtLjcwOC4wNjQtMS4zNC40NzQtMS43MTQuMzE3LS4yOTQuNzktLjM0MyAxLjczNC0uNDM1Ljk1OS0uMDk3IDEuNjg1LS4xNyAxLjk0Ni4yMjEuMjU3LjM4Ny0uMDY4IDEuMDE4LS4xMzYgMS4xNTUtLjU1NCAxLjA3OS0xLjk1OSAxLjQ1Ny0yLjkxOCAxLjU5ek0yNTUuODQ0IDE4LjU4N2MuMTQuNDMtLjI2OSAxLjEwMi0uOTM5IDEuNDc2LS44OTEuNDk1LTEuNzAyLjc0NS0yLjIxMi42MDgtLjM5Ny0uMTA5LS41MDItLjUwMy0uNzA2LTEuMjkyLS4yMDktLjgtLjM2Ni0xLjQwNC4xMDgtMS44NzUuNDY2LS40NjMgMS4yOTYtLjU1MSAxLjQ3Ny0uNTcxIDEuNDEzLS4xNTMgMi4wMTUuODc3IDIuMjcyIDEuNjU0ek0yNTcuNTU3IDIzLjk4M2MuMTYxLjQxNS0uMTM2IDEuMDEtLjY5IDEuMy0uNzM0LjM4Ni0xLjQyNS41NDctMS44ODIuMzctLjM1OC0uMTM3LS40ODItLjUxNS0uNzM1LTEuMjcyLS4yNTMtLjc2OC0uNDQ1LTEuMzQ4LS4wNzItMS43NDYuMzY1LS4zOSAxLjA4NC0uMzk5IDEuMjQtLjQwMyAxLjIyOC0uMDE2IDEuODQ2IDEuMDAyIDIuMTM5IDEuNzV6TTI3NS41NzEgMTYuNTFjLS4wMjguNDUyLS42NTguOTI2LTEuNDE2IDEuMDIzLTEuMDA4LjEyOS0xLjg1OS4wNi0yLjI4LS4yNTgtLjMyOS0uMjQ5LS4yODEtLjY1MS0uMTgxLTEuNDYuMTA0LS44MjIuMTgxLTEuNDQxLjc5NS0xLjcwMy42MDItLjI1OCAxLjQwOS0uMDMyIDEuNTgxLjAxNiAxLjM2OS4zODYgMS41NDkgMS41NjYgMS41MDEgMi4zODN6TTI2Ni45NTMgMjAuMDkyYy0uNTIyLjA3My0xLjAxOS0uMjk4LTEuMDc2LS44Mi0uMDgtLjcxLjA2NS0xLjM0MS40NzQtMS43MTUuMzE3LS4yOTQuNzkxLS4zNDMgMS43MzQtLjQzNS45NTktLjA5NyAxLjY4Ni0uMTcgMS45NDcuMjIxLjI1Ny4zODctLjA2OSAxLjAxOC0uMTM3IDEuMTU1LS41NTggMS4wODctMS45ODMgMS40NjUtMi45NDIgMS41OTR6TTI2Ny4yMDMgMzcuODk3Yy0xLjg1NC0xLjY4MiAxLjE4OC0xMC44NTYgNi42OTUtMTEuOTgzLjI0MS0uMDQ5IDIuOTEtLjU2NCAzLjg5My43ODQgMS41MTcgMi4wOC0xLjQ4MSA3LjkwNy02LjEwMSAxMC4zMDUtLjk5NS41MjMtMy40NzYgMS44MTEtNC40ODcuODk0eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNCN0JGRDEiIGQ9Ik0yNjAuMDcgNjYuMDgzczcuMTU2LTMuNDIgMTQuNzIyLTQuMDJsLTEzLjU5OC0uMjQ1LTEuMTI0IDQuMjY1eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0yNTguNTY5IDIxLjMyN2wuMTg1LjM4Ni4xNjUgMi44ODUtLjY1OS42NmMuMDA0LjAwNC0uMjU2LTIuNTE5LjMwOS0zLjkzMXoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjODA5RUVEIiBkPSJNMjYwLjM1NSAzNy4wOGMtLjI0OS0uMTQxLS4yMjktLjUwMy4wMzYtLjYxMi40MDItLjE2Ljg0Ny0uMzg2IDEuMzEzLS42OTIgMS4yOC0uODQ5IDEuNTMzLTEuNTg1IDIuMDYzLTEuNTI1Ljk0Ny4xMDkgMS45MjIgMi42NiAxLjE1MiAzLjU1Ny0uNjE0LjcyLTIuNDI1LjQ3LTQuNTY0LS43Mjh6TTI1OC45NzEgNjEuNzgybDIuNTY5LjA0NGMuMzMzLTcuNDg0IDMuMTc5LTE0LjkwNCAzLjMwMy0yMC43NDNsLTMuMDc1LjM5OWMuNDU4IDIuNDQ2IDEuMjA1IDkuNjQ1LTIuNzk3IDIwLjN6TTE5Mi41NTYgMTA4LjI1MmwtLjI1My0uNzg5cy0xNy4xMjYgMy42NTQtNC40NzUgMjcuNzA0bC4zNDktLjZjLTEwLjAzLTIwLjA4MiAxLjM0OS0yNS4zMTcgNC4zNzktMjYuMzE1eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiMyMzJDM0YiIGQ9Ik0xOTEuMTE1IDExNS42MDRjLS41NDItLjgwNS0xLjA1Ni0xLjYzOC0xLjc2Mi0yLjQzMS4wMTIuNTM5LjE0OSAxLjA0Ny4zMTcgMS41MzguMTc3LjQ4Ny40MDUuOTU4LjY5NCAxLjM5Mi4wODkuMTMzLjE4MS4yNjIuMjc3LjM4Ny4yMzMtLjIxOC40NTQtLjQyMy42NjMtLjYtLjA2NS0uMDk3LS4xMjUtLjE5My0uMTg5LS4yODZ6TTE4Ni40NzEgMTIwLjg3MWMuNDcuMjY1Ljk3Mi40MSAxLjQ3Ny41MTkuNDMuMDg0Ljg2Ny4xMTcgMS4zMDkuMTE3LS4wMzItLjI5OC0uMDUyLS41OTYtLjA2NC0uODg2LS44ODMuMDQtMS43NzQuMDY5LTIuNzIyLjI1ek0xODkuOTE5IDEyNC43NzRsLS4wNzcuMDQ4Yy0uODIyLjUxOS0xLjY2NSAxLjAwNi0yLjQ4IDEuNjkuNTM4LjAwNCAxLjA0OC0uMTEyIDEuNTQxLS4yNjkuNDQ2LS4xNDUuODc1LS4zNDIgMS4yODEtLjU4NC0uMDkzLS4yODYtLjE4MS0uNTgzLS4yNjUtLjg4NXpNMjc1LjY4NyAxMi4zNDZjLS41MjYuMDkyLTEuMDU2LjE2NS0xLjU5OC4yMDVsLS4wMDQuMDQ0Yy41MzguMDg5IDEuMDg4LjEyMSAxLjYzOC4xaC4wOTZjLS40MjkuMjUtLjg2Ny40ODQtMS4zMjQuNjkzbC4wMTIuMDRjLjUzMy0uMTA0IDEuMDU5LS4yNyAxLjU2OS0uNDc1LjAyNC0uMDEyLjA0OC0uMDIuMDc2LS4wMjhsLS4wNC0uNjcyYy0uMTQuMDI4LS4yODEuMDY5LS40MjUuMDkzek0yNzUuNjkxIDE5Ljg5OGwuMDA0LjA0NGMuMjg5LjAwOS41NzggMCAuODY3LS4wMjRsLS4wMTItLjIyOWMtLjI4NS4wOC0uNTcuMTQ5LS44NTkuMjF6TTI1Ny41NSAxOS4zNmMtLjI1Ny4yODUtLjUyMi41Ny0uODAzLjg0bC4wMjguMDM3Yy4zMTctLjE4Ni42MTQtLjM5OS45MDMtLjYyNGwtLjI2OS0uNTQ0Yy0uMzk3LjI5NC0uODQ3LjUyNC0xLjMzMi42ODlsLjAwOC4wNDRjLjI4MS0uMDMyLjU2Mi0uMDg1LjgzOS0uMTcuMjEyLS4wNzIuNDIxLS4xNjguNjI2LS4yNzN6TTI3Ni43NTEgMzYuNTU3Yy0xLjk4MyAxLjQ0NC01LjE5NCAzLjQwOC04LjM3MiAzLjczOCAwIDAgNS4zMy40OTUgOS40MDQtLjk2NmwtMS4wMzItMi43NzJ6TTI2Mi42MzEgNDAuNjgxYy0uMzgxLS4wNC0uNzYyLS4xMzctMS4xNDQtLjEzNy4wMjQuMDA0LjA0OC4wMTIuMDY5LjAxNiAwIDAgLjA5Mi4zMDYuMjA0Ljg5NC4yODUtLjAwOC41NzQtLjA1My44NTktLjA3My40NDYtLjAyOC44OTEtLjA3NiAxLjMzMy0uMTQuNDQxLS4wNzMuODgzLS4xNDEgMS4zMTYtLjI1NGwtLjAwOC0uMDg5Yy0uNDQxLS4wMjgtLjg4My0uMDUyLTEuMzItLjFsLTEuMzA5LS4xMTd6TTI4MC43MDEgMTQ4LjUzYy0uOTExLjMxLTEuNzcuNzU3LTIuNjY5IDEuMTE1cy0xLjgwMy43LTIuNzIyIDEuMDE4Yy0uOTExLjMzNC0xLjgzNC42MzItMi43NTcuOTM4bC4wMi4wODVjLjk1OS0uMTc0IDEuOTExLS4zODMgMi44NjItLjYwNC45NDctLjIzNCAxLjg5LS40OTUgMi44MjUtLjc3Ny45MzYtLjI5IDEuODk1LS41MzEgMi43NzQtLjk3LjAyOC0uMDEyLjA1Ni0uMDI4LjA4NC0uMDQ0bC0uMTkzLS44NDVjLS4wNzIuMDMyLS4xNDguMDYtLjIyNC4wODR6TTI4MS4yMjMgNTcuMTU4Yy4xMDguMTU3LjE2OC4zMDIuMjIuNDQzLjA0OS4xNDEuMDg1LjI4Mi4xMDEuNDE1LjAyLjEzMy4wMi4yNjEuMDA4LjM4Ni0uMDE2LjEyLS4wNDQuMjQyLS4xMTcuMzQyLS4xMDgtLjE2LS4xNzItLjMxLS4yMjQtLjQ1LS4wNDktLjE0MS0uMDgxLS4yNzgtLjEwMS0uNDA3LS4wMTYtLjEyOS0uMDItLjI1OC0uMDA4LS4zNzguMDItLjEyNS4wNDgtLjI0Mi4xMjEtLjM1ek0yNzcuMzkzIDQzLjc5NWMuNDcuOTM4Ljg3MSAxLjkgMS4yMzYgMi44NjEuMzc0Ljk2Ni42OTkgMS45MzYuOTk2IDIuOTEuMTQ4LjQ4Ni4yODEuOTczLjQxNyAxLjQ1Ni4xMi40ODcuMjUzLjk3LjM1MyAxLjQ1My4yMjUuOTY1LjM5IDEuOTI3LjQ5OCAyLjg2OS0uMjg5LS45NzQtLjU0Mi0xLjkzNi0uODIzLTIuODk4LS4yNzctLjk2MS0uNTU0LTEuOTE5LS44NTEtMi44OC0uMjg1LS45NjItLjU5NC0xLjkyLS44OTktMi44ODJsLS45MjctMi44ODl6TTI1Ni44MTEgMTM4LjM5OGMtOS4xNDcgNC44MzMtMTkuMDU3IDguMDU2LTI5LjI5MiA5LjUyOGwtNS4xNzMtMTUuOTgyIDMuMzIzLTEuNTg5YzcuNDE3LTMuNTQ5IDE1LjI4LTYuMDY4IDIzLjM3Ni03LjQ4NWwyLjU5Mi0uNDU0IDUuMTc0IDE1Ljk4MnoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjQjdCRkQxIiBkPSJNMjMyLjc0MSAxNDQuOTgxYy0uMTc3LjIwNS0uMzcuMzIyLS41NjYuNDE5LS4xOTcuMDg4LS40MDIuMTQ1LS42MDYuMTczLS4yMDUuMDI4LS40MTguMDI0LS42My0uMDEyLS4yMTMtLjA0NS0uNDMtLjEwOS0uNjUxLS4yNjIuMTg1LS4yMDkuMzgyLS4zMjYuNTc0LS40MjIuMTk3LS4wODkuMzk0LS4xNDUuNTk4LS4xNzQuMjAxLS4wMjQuNDEtLjAyLjYyMi4wMTcuMjA5LjA0NC40MjYuMTA4LjY1OS4yNjF6TTI1MS45MjYgMTM4LjIwNWMtMS4xOTIuODgxLTIuNDgxIDEuNjI2LTMuNzk3IDIuMzAyLTEuMzEyLjY4NC0yLjY3MyAxLjI3NS00LjA1NCAxLjgwNi0uNjkuMjY2LTEuMzkzLjQ5OS0yLjA5NS43NDEtLjcxLjIwNS0xLjQxMy40NDYtMi4xMzUuNjExLTEuNDI5LjM4My0yLjg5NC42NDQtNC4zNjMuNzk3IDEuMzkzLS41MTEgMi43ODktLjk1NCA0LjE2Ni0xLjQ1MyAxLjM4MS0uNDg2IDIuNzUzLS45ODUgNC4xMTQtMS41MTIgMS4zNjktLjUxMiAyLjcyNS0xLjA2MyA0LjA4Mi0xLjYxbDQuMDgyLTEuNjgyek0yNDcuMjc5IDEyNS4yOTNjLjE5Ni0uMjI1LjQxMy0uMzU4LjYzOC0uNDcxLjIyNS0uMTA5LjQ1My0uMTg1LjY5LS4yMjkuMjM3LS4wNDUuNDc4LS4wNjEuNzI3LS4wNDUuMjQ4LjAyNC41MDEuMDY5Ljc2Ni4yMDYtLjIwNS4yMjUtLjQyMS4zNjItLjY0Mi40NzUtLjIyMS4xMDgtLjQ1LjE4MS0uNjgyLjIyNS0uMjMzLjA0NC0uNDc0LjA2LS43MTkuMDQtLjI1My0uMDI0LS41MDYtLjA2OC0uNzc4LS4yMDF6TTIyNC4yOTMgMTMzLjAxOWMxLjUxNy0uOTAyIDMuMDk4LTEuNjcgNC43MDQtMi4zODIgMS42MDUtLjcyMSAzLjI0My0xLjM1NiA0Ljg5Ni0xLjk1Mi44MjctLjI5NCAxLjY2Ni0uNTYzIDIuNTAxLS44MzMuODQ3LS4yNDUgMS42ODItLjUxNSAyLjUzMy0uNzI4IDEuNjkzLS40NjMgMy40MTktLjgyNSA1LjE1Ny0xLjA5MS0xLjY1LjYxNi0zLjMxMSAxLjE2My00Ljk2MSAxLjc0My0xLjY0OS41NzUtMy4yOTkgMS4xNDItNC45NDUgMS43MzQtMy4yOTEgMS4xNTUtNi41NTggMi4zNjYtOS44ODUgMy41MDl6Ii8+CiAgICAgICAgPG1hc2sgaWQ9Im1lZnp6cWswamIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgeD0iMjMyIiB5PSIxMjciIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8ZWxsaXBzZSBmaWxsPSIjQzRDNEM0IiByeD0iNy41NDYiIHJ5PSI3LjU0NSIgdHJhbnNmb3JtPSJtYXRyaXgoMC45NDk0NDggLTAuMzEzOTI0IDAuMzE0MDc4IDAuOTQ5Mzk3IDI0MC4wMzkgMTM1LjI0NCkiLz4KICAgICAgICA8L21hc2s+CiAgICAgICAgPGcgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIG1hc2s9InVybCgjbWVmenpxazBqYikiPgogICAgICAgICAgICA8cGF0aCBmaWxsPSIjNUE4MUVBIiBkPSJNMjQwLjAzOSAxMzUuMjQ0bDYuMzU2IDMuMTk2LTkuNTUzIDMuMTU4IDMuMTk3LTYuMzU0eiIvPgogICAgICAgICAgICA8cGF0aCBmaWxsPSIjRTE0QjUxIiBkPSJNMjQwLjAzOSAxMzUuMjQ0bDMuMTk3LTYuMzU1LTkuNTUzIDMuMTU5IDYuMzU2IDMuMTk2eiIvPgogICAgICAgIDwvZz4KICAgIDwvZz4KICAgIDxkZWZzPgogICAgICAgIDxjbGlwUGF0aCBpZD0iY2xpcDAiPgogICAgICAgICAgICA8cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCAwSDM1NC42MjhWMzI0LjgzM0gweiIgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjYwODQgMC40OTk4OTggLTAuNTAwMTAyIDAuODY1OTY2IDE1My4zNzYgLTE1Mi41NTkpIi8+CiAgICAgICAgPC9jbGlwUGF0aD4KICAgIDwvZGVmcz4KPC9zdmc+Cg==";
const RegistrationSuccessful = ({
  onLogin
}) => {
  return /* @__PURE__ */ React__default.createElement(Box, {
    px: "24px"
  }, /* @__PURE__ */ React__default.createElement(Box, {
    width: "100%",
    height: "174px",
    backgroundImage: `url(${imgUrl})`,
    mb: "24px"
  }), /* @__PURE__ */ React__default.createElement(Box, {
    color: "#9ba6b2",
    fontSize: "13px",
    textAlign: "center",
    mb: "16px"
  }, "To start trading and investing with Waves.exchange, please log in."), /* @__PURE__ */ React__default.createElement(Box, {
    px: "16px",
    mb: "40px"
  }, /* @__PURE__ */ React__default.createElement(Button, {
    variant: "primary",
    variantSize: "medium",
    width: "100%",
    onClick: onLogin
  }, "Log In")));
};
(function(window2) {
  if (typeof window2 === "undefined") {
    throw new Error("Geetest requires browser environment");
  }
  var document = window2.document;
  var Math2 = window2.Math;
  var head = document.getElementsByTagName("head")[0];
  function _Object(obj) {
    this._obj = obj;
  }
  _Object.prototype = {
    _each: function(process) {
      var _obj = this._obj;
      for (var k in _obj) {
        if (_obj.hasOwnProperty(k)) {
          process(k, _obj[k]);
        }
      }
      return this;
    }
  };
  function Config(config) {
    var self = this;
    new _Object(config)._each(function(key, value) {
      self[key] = value;
    });
  }
  Config.prototype = {
    api_server: "api.geetest.com",
    protocol: "http://",
    typePath: "/gettype.php",
    fallback_config: {
      slide: {
        static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
        type: "slide",
        slide: "/static/js/geetest.0.0.0.js"
      },
      fullpage: {
        static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
        type: "fullpage",
        fullpage: "/static/js/fullpage.0.0.0.js"
      }
    },
    _get_fallback_config: function() {
      var self = this;
      if (isString(self.type)) {
        return self.fallback_config[self.type];
      } else if (self.new_captcha) {
        return self.fallback_config.fullpage;
      } else {
        return self.fallback_config.slide;
      }
    },
    _extend: function(obj) {
      var self = this;
      new _Object(obj)._each(function(key, value) {
        self[key] = value;
      });
    }
  };
  var isNumber = function(value) {
    return typeof value === "number";
  };
  var isString = function(value) {
    return typeof value === "string";
  };
  var isBoolean = function(value) {
    return typeof value === "boolean";
  };
  var isObject = function(value) {
    return typeof value === "object" && value !== null;
  };
  var isFunction = function(value) {
    return typeof value === "function";
  };
  var MOBILE = /Mobi/i.test(navigator.userAgent);
  var pt = MOBILE ? 3 : 0;
  var callbacks = {};
  var status = {};
  var nowDate = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day2 = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day2 >= 0 && day2 <= 9) {
      day2 = "0" + day2;
    }
    if (hours >= 0 && hours <= 9) {
      hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = year + "-" + month + "-" + day2 + " " + hours + ":" + minutes + ":" + seconds;
    return currentdate;
  };
  var random = function() {
    return parseInt(Math2.random() * 1e4) + new Date().valueOf();
  };
  var loadScript = function(url, cb) {
    var script = document.createElement("script");
    script.charset = "UTF-8";
    script.async = true;
    if (/static\.geetest\.com/g.test(url)) {
      script.crossOrigin = "anonymous";
    }
    script.onerror = function() {
      cb(true);
    };
    var loaded = false;
    script.onload = script.onreadystatechange = function() {
      if (!loaded && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete")) {
        loaded = true;
        setTimeout(function() {
          cb(false);
        }, 0);
      }
    };
    script.src = url;
    head.appendChild(script);
  };
  var normalizeDomain = function(domain) {
    return domain.replace(/^https?:\/\/|\/$/g, "");
  };
  var normalizePath = function(path) {
    path = path.replace(/\/+/g, "/");
    if (path.indexOf("/") !== 0) {
      path = "/" + path;
    }
    return path;
  };
  var normalizeQuery = function(query) {
    if (!query) {
      return "";
    }
    var q = "?";
    new _Object(query)._each(function(key, value) {
      if (isString(value) || isNumber(value) || isBoolean(value)) {
        q = q + encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
      }
    });
    if (q === "?") {
      q = "";
    }
    return q.replace(/&$/, "");
  };
  var makeURL = function(protocol, domain, path, query) {
    domain = normalizeDomain(domain);
    var url = normalizePath(path) + normalizeQuery(query);
    if (domain) {
      url = protocol + domain + url;
    }
    return url;
  };
  var load = function(config, send, protocol, domains, path, query, cb) {
    var tryRequest = function(at) {
      var url = makeURL(protocol, domains[at], path, query);
      loadScript(url, function(err) {
        if (err) {
          if (at >= domains.length - 1) {
            cb(true);
            if (send) {
              config.error_code = 508;
              var url2 = protocol + domains[at] + path;
              reportError(config, url2);
            }
          } else {
            tryRequest(at + 1);
          }
        } else {
          cb(false);
        }
      });
    };
    tryRequest(0);
  };
  var jsonp = function(domains, path, config, callback) {
    if (isObject(config.getLib)) {
      config._extend(config.getLib);
      callback(config);
      return;
    }
    if (config.offline) {
      callback(config._get_fallback_config());
      return;
    }
    var cb = "geetest_" + random();
    window2[cb] = function(data) {
      if (data.status == "success") {
        callback(data.data);
      } else if (!data.status) {
        callback(data);
      } else {
        callback(config._get_fallback_config());
      }
      window2[cb] = void 0;
      try {
        delete window2[cb];
      } catch (e) {
      }
    };
    load(config, true, config.protocol, domains, path, {
      gt: config.gt,
      callback: cb
    }, function(err) {
      if (err) {
        callback(config._get_fallback_config());
      }
    });
  };
  var reportError = function(config, url) {
    load(config, false, config.protocol, ["monitor.geetest.com"], "/monitor/send", {
      time: nowDate(),
      captcha_id: config.gt,
      challenge: config.challenge,
      pt,
      exception_url: url,
      error_code: config.error_code
    }, function(err) {
    });
  };
  var throwError = function(errorType, config) {
    var errors = {
      networkError: "\u7F51\u7EDC\u9519\u8BEF",
      gtTypeError: "gt\u5B57\u6BB5\u4E0D\u662F\u5B57\u7B26\u4E32\u7C7B\u578B"
    };
    if (typeof config.onError === "function") {
      config.onError(errors[errorType]);
    } else {
      throw new Error(errors[errorType]);
    }
  };
  var detect = function() {
    return window2.Geetest || document.getElementById("gt_lib");
  };
  if (detect()) {
    status.slide = "loaded";
  }
  window2.initGeetest = function(userConfig, callback) {
    var config = new Config(userConfig);
    if (userConfig.https) {
      config.protocol = "https://";
    } else if (!userConfig.protocol) {
      config.protocol = window2.location.protocol + "//";
    }
    if (userConfig.gt === "050cffef4ae57b5d5e529fea9540b0d1" || userConfig.gt === "3bd38408ae4af923ed36e13819b14d42") {
      config.apiserver = "yumchina.geetest.com/";
      config.api_server = "yumchina.geetest.com";
    }
    if (userConfig.gt) {
      window2.GeeGT = userConfig.gt;
    }
    if (userConfig.challenge) {
      window2.GeeChallenge = userConfig.challenge;
    }
    if (isObject(userConfig.getType)) {
      config._extend(userConfig.getType);
    }
    jsonp([config.api_server || config.apiserver], config.typePath, config, function(newConfig) {
      var type = newConfig.type;
      var init = function() {
        config._extend(newConfig);
        callback(new window2.Geetest(config));
      };
      callbacks[type] = callbacks[type] || [];
      var s = status[type] || "init";
      if (s === "init") {
        status[type] = "loading";
        callbacks[type].push(init);
        load(config, true, config.protocol, newConfig.static_servers || newConfig.domains, newConfig[type] || newConfig.path, null, function(err) {
          if (err) {
            status[type] = "fail";
            throwError("networkError", config);
          } else {
            status[type] = "loaded";
            var cbs = callbacks[type];
            for (var i = 0, len = cbs.length; i < len; i = i + 1) {
              var cb = cbs[i];
              if (isFunction(cb)) {
                cb();
              }
            }
            callbacks[type] = [];
          }
        });
      } else if (s === "loaded") {
        init();
      } else if (s === "fail") {
        throwError("networkError", config);
      } else if (s === "loading") {
        callbacks[type].push(init);
      }
    });
  };
})(window);
const w = window;
const getGeeTestToken = (geetestUrl) => {
  return new Promise(async (res, rej) => {
    try {
      const response = await fetch(geetestUrl, {
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) {
        rej(data);
      }
      if (!w.initGeetest) {
        return rej();
      }
      w.initGeetest({
        gt: data.gt,
        lang: "en",
        hideSuccess: true,
        hideClose: false,
        challenge: data.challenge,
        offline: !data.success,
        new_captcha: true,
        product: "bind",
        onError: rej
      }, function(geeTestObj) {
        if (!geeTestObj) {
          return rej();
        }
        geeTestObj.appendTo("body");
        geeTestObj.onReady(() => geeTestObj.verify());
        geeTestObj.onSuccess(() => res(geeTestObj.getValidate()));
        geeTestObj.onError(rej);
        geeTestObj.onClose(rej);
      }, rej);
    } catch (e) {
      rej(e);
    }
  });
};
const iconAttention = {
  path: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", {
    fill: "#FFAF00",
    fillRule: "evenodd",
    d: "M40 80C17.945 80 0 62.055 0 40S17.945 0 40 0s40 17.945 40 40-17.945 40-40 40zm-.003-77c-20.4 0-37 16.6-37 37s16.6 37 37 37 37-16.6 37-37-16.6-37-37-37zM40 46.692a1.54 1.54 0 0 0 1.47-1.08l5.396-19.272c.69-2.208.3-4.543-1.07-6.408A7.128 7.128 0 0 0 40 17a7.123 7.123 0 0 0-5.795 2.932 7.124 7.124 0 0 0-1.071 6.408l5.398 19.272c.2.643.794 1.08 1.468 1.08zm0-26.615c1.323 0 2.534.61 3.317 1.678a4.074 4.074 0 0 1 .612 3.667L40 39.995l-3.93-14.573a4.074 4.074 0 0 1 .613-3.667A4.076 4.076 0 0 1 40 20.077zM45.497 56.5c0-3.033-2.467-5.5-5.5-5.5a5.506 5.506 0 0 0-5.5 5.5c0 3.033 2.467 5.5 5.5 5.5s5.5-2.467 5.5-5.5zm-3 0c0 1.379-1.121 2.5-2.5 2.5a2.503 2.503 0 0 1-2.5-2.5c0-1.379 1.121-2.5 2.5-2.5s2.5 1.121 2.5 2.5z"
  })),
  viewBox: "0 0 80 80"
};
const Enable2FaComponent = (props) => {
  return /* @__PURE__ */ React.createElement(Box, {
    textAlign: "center",
    px: "40px",
    py: "32px"
  }, /* @__PURE__ */ React.createElement(Icon, {
    size: "80px",
    icon: iconAttention,
    color: "#FFAF00",
    mb: "32px"
  }), /* @__PURE__ */ React.createElement(Text, {
    variant: "heading2",
    display: "block",
    color: "#fff",
    mb: "32px"
  }, "Your account is at risk"), /* @__PURE__ */ React.createElement(PlateNote, {
    type: "warning",
    mb: "32px",
    p: "16px"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    color: "#fff",
    textAlign: "left",
    fontWeight: 300
  }, "It is highly recommended to enable 2-factor authentification as quickly as possible. Otherwise, your account is at risk. You can enable 2FA in the Security section of your account settings at \xA0", /* @__PURE__ */ React.createElement(ExternalLink, {
    href: "https://waves.exchange/sign-in/email"
  }, "Waves.Exchange."))), /* @__PURE__ */ React.createElement(ExternalLink, {
    href: "https://waves.exchange/settings"
  }, /* @__PURE__ */ React.createElement(Button, {
    variant: "primary",
    variantSize: "medium",
    width: "100%",
    onClick: props.onClose
  }, "Enable 2FA")));
};
const VerifyCodeComponent = ({
  codeLength = 6,
  timerTime = 59,
  onSendCode,
  onValidationFunc,
  onApplyCode,
  disableAfterMistake,
  onPendingChange: onPending,
  isPending,
  isCodeSent = true,
  inputMode
}) => {
  const [secondsLeft, setSecondsLeft] = React.useState(isCodeSent ? timerTime : 0);
  const [isIncorrectCode, setIsIncorrectCode] = React.useState(false);
  const [isFilled, setIsFilled] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const refs = React.useMemo(() => {
    return new Array(codeLength).fill(void 0).map(() => React.createRef());
  }, [codeLength]);
  const [values, setValues] = React.useState(refs.map(() => ""));
  const [autoFocusIndex, setAutoFocusIndex] = React.useState(0);
  React.useEffect(() => {
    if (secondsLeft) {
      const timeoutId = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1e3);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [secondsLeft]);
  React.useEffect(() => {
    let mounted = true;
    if (values.length < codeLength || values.some((v) => !v)) {
      setIsFilled(false);
      return;
    }
    onPending(true);
    if (typeof onApplyCode === "function") {
      const code = values.join("");
      onApplyCode(code).then((result) => {
        if (!mounted) {
          return;
        }
        setIsFilled(true);
        onPending(false);
        setIsIncorrectCode(!result);
        if (!result && disableAfterMistake || result) {
          setIsDisabled(true);
        }
      }).catch(() => {
        if (!mounted) {
          return;
        }
        setIsFilled(true);
        onPending(false);
        setIsIncorrectCode(true);
        if (disableAfterMistake) {
          setIsDisabled(true);
        }
      });
    } else {
      setIsFilled(true);
      onPending(false);
    }
    return () => {
      mounted = false;
    };
  }, [values, onApplyCode, refs, codeLength, disableAfterMistake, onPending]);
  const onInputClick = React.useCallback((e) => {
    const index = Number(e.currentTarget.dataset.index);
    setAutoFocusIndex(index);
  }, []);
  const changeHandler = React.useCallback((value, index) => {
    setIsIncorrectCode(false);
    if (!value) {
      setValues(values.map((v, currentIndex) => currentIndex === index ? "" : v));
      return;
    }
    if (typeof onValidationFunc === "function" && !onValidationFunc(value)) {
      return;
    }
    const filledValues = value.split("");
    const newValues = values.map((v, currentIndex) => {
      if (currentIndex < index) {
        return v;
      }
      return filledValues[currentIndex - index] || v;
    });
    const nextIndex = index + filledValues.length;
    const el = refs[nextIndex] && refs[nextIndex].current;
    if (el) {
      el.focus();
    }
    setAutoFocusIndex(nextIndex);
    setValues(newValues);
  }, [onValidationFunc, refs, values]);
  const onChange = React.useCallback((e) => {
    const value = e.target.value;
    const index = Number(e.target.dataset.index);
    changeHandler(value, index);
  }, [changeHandler]);
  const onKeyDown = React.useCallback((e) => {
    const keyCode = e.keyCode;
    const i = Number(e.currentTarget.dataset.index);
    const prevIndex = i - 1;
    const nextIndex = i + 1;
    const currentInput = refs[i] && refs[i].current;
    const prevInput = refs[prevIndex] ? refs[prevIndex].current : null;
    const nextInput = refs[nextIndex] ? refs[nextIndex].current : null;
    if (!currentInput) {
      return;
    }
    const KEY_CODE = {
      backspace: 8,
      left: 37,
      right: 39
    };
    switch (keyCode) {
      case KEY_CODE.left: {
        e.preventDefault();
        if (prevInput) {
          prevInput.focus();
        }
        break;
      }
      case KEY_CODE.right: {
        e.preventDefault();
        if (nextInput) {
          nextInput.focus();
        }
        break;
      }
      case KEY_CODE.backspace: {
        e.preventDefault();
        if (currentInput.value) {
          changeHandler("", i);
        } else if (prevInput) {
          prevInput.focus();
          changeHandler("", prevIndex);
        }
        break;
      }
    }
  }, [refs, changeHandler]);
  const handleSendCodeClick = React.useCallback(async () => {
    if (typeof onSendCode === "function") {
      await onSendCode();
      setValues(refs.map(() => ""));
      setIsDisabled(false);
      setSecondsLeft(timerTime);
    }
  }, [onSendCode, refs, timerTime]);
  return /* @__PURE__ */ React.createElement(Flex, null, /* @__PURE__ */ React.createElement(Box, {
    mr: [null, "24px"]
  }, /* @__PURE__ */ React.createElement(Flex, null, /* @__PURE__ */ React.createElement(Flex, {
    mb: "10px"
  }, refs.map((ref, i) => /* @__PURE__ */ React.createElement(Input, {
    key: i,
    ref,
    value: values[i],
    autoFocus: autoFocusIndex === i,
    inputMode,
    onClick: onInputClick,
    onChange,
    onKeyDown,
    disabled: isDisabled,
    "data-index": i,
    width: "48px",
    height: "48px",
    mr: "8px",
    pl: "19px !important",
    pr: "18px !important",
    sx: {
      ":last-of-type": {
        mr: "0"
      }
    }
  }))), isPending && /* @__PURE__ */ React.createElement(Flex, {
    justifyContent: "center",
    alignItems: "center",
    ml: "24px",
    mb: "10px"
  }, /* @__PURE__ */ React.createElement(DotLoader, null))), (isFilled || isDisabled) && isIncorrectCode && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Text, {
    fontSize: "12px",
    lineHeight: "14px",
    color: "danger.$300",
    textAlign: "right",
    display: "inline-block",
    width: "100%"
  }, "Wrong code. Please, try again"))), isPending || isFilled && !isIncorrectCode || !onSendCode ? null : /* @__PURE__ */ React.createElement(Box, {
    height: "48px"
  }, secondsLeft ? /* @__PURE__ */ React.createElement(Flex, {
    color: "primary.$300",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%"
  }, /* @__PURE__ */ React.createElement(Text, {
    variant: "body2",
    textAlign: "center"
  }, "Resend code in ", secondsLeft, " seconds")) : /* @__PURE__ */ React.createElement(Button, {
    variantSize: "medium",
    border: "1px solid",
    borderColor: "primary.$300",
    color: "primary.$300",
    backgroundColor: "transparent",
    px: "8px !important",
    onClick: handleSendCodeClick,
    sx: {
      whiteSpace: "nowrap",
      ":hover": {
        borderColor: "primary.$500",
        color: "primary.$500"
      }
    }
  }, "Send Code")));
};
const CodeConfirmation = ({
  codeDelivery,
  confirmCode,
  resendCode
}) => {
  const [isPending, setIsPending] = useState(false);
  const handleConfirmCode = React__default.useCallback(async (code) => {
    try {
      await confirmCode(code);
      return true;
    } catch (e) {
      return false;
    }
  }, [confirmCode]);
  const destination = codeDelivery == null ? void 0 : codeDelivery.destination;
  return /* @__PURE__ */ React__default.createElement(Flex, {
    as: "form",
    px: "$40",
    pb: "$40",
    flexDirection: "column",
    justifyContent: "center"
  }, /* @__PURE__ */ React__default.createElement(Box, {
    mb: "24px",
    textAlign: "center"
  }, /* @__PURE__ */ React__default.createElement(Text, {
    variant: "body2",
    color: "basic.$500"
  }, "Please enter the 6-digit verification code received by", " ", destination, "."), (codeDelivery == null ? void 0 : codeDelivery.type) === "EMAIL" && /* @__PURE__ */ React__default.createElement(Text, {
    variant: "body2",
    color: "basic.$500"
  }, " ", "If you don't receive the code, check the spam box or resend the code again.")), /* @__PURE__ */ React__default.createElement(Flex, {
    justifyContent: "center"
  }, /* @__PURE__ */ React__default.createElement(VerifyCodeComponent, {
    isPending,
    isCodeSent: Boolean(codeDelivery),
    inputMode: "decimal",
    onPendingChange: setIsPending,
    onSendCode: resendCode,
    onApplyCode: handleConfirmCode
  })));
};
const day = 1e3 * 60 * 60 * 24;
const Login = ({
  identity,
  onConfirm,
  onCancel,
  sendAnalytics
}) => {
  var _a;
  const [loginState, setLoginState] = useState("sign-in");
  const [codeDelivery, setCodeDelivery] = useState();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const userData = useRef();
  const handleSuccess = useCallback(() => {
    try {
      const enable2FATimestamp = Number(localStorage.getItem("enable2FATimestamp"));
      if (!is2FAEnabled && (!enable2FATimestamp || Date.now() - enable2FATimestamp >= day)) {
        setLoginState("enable-2fa");
        localStorage.setItem("enable2FATimestamp", Date.now().toString());
        return;
      }
    } catch (e) {
      console.log(e);
    }
    if (typeof sendAnalytics === "function") {
      sendAnalytics({ name: "Login_Page_SignIn_Success" });
    }
    onConfirm({
      address: identity.getUserAddress(),
      publicKey: identity.getUserPublicKey()
    });
  }, [identity, is2FAEnabled, onConfirm]);
  const onCloseClick = useCallback(() => {
    if (loginState === "enable-2fa") {
      handleSuccess();
    } else {
      onCancel();
    }
  }, [handleSuccess, loginState, onCancel]);
  const resendSignUp = useCallback(async () => {
    const result = await identity.resendSignUp();
    setCodeDelivery(result);
    setLoginState(loginState === "sign-in" ? "confirm-sign-in" : "confirm-sign-up");
  }, [identity, loginState]);
  const signIn = useCallback(async (username, password) => {
    try {
      const geeTest = await getGeeTestToken(identity.geetestUrl);
      const cognitoUser = await identity.signIn(username, password, geeTest);
      const challengeName = cognitoUser.challengeName;
      switch (challengeName) {
        case "SMS_MFA":
          setCodeDelivery({ type: "SMS", destination: "" });
          setLoginState("confirm-sign-in");
          setIs2FAEnabled(true);
          break;
        case "SOFTWARE_TOKEN_MFA":
          setCodeDelivery({
            type: "TOTP",
            destination: "TOTP device"
          });
          setLoginState("confirm-sign-in");
          setIs2FAEnabled(true);
          break;
        default:
          handleSuccess();
      }
    } catch (e) {
      if (e && e.code === "UserNotConfirmedException") {
        userData.current = { username, password };
        await resendSignUp();
      } else {
        throw e;
      }
    }
  }, [handleSuccess, identity, resendSignUp]);
  const signUp = useCallback(async (username, password) => {
    const geeTest = await getGeeTestToken(identity.geetestUrl);
    const result = await identity.signUp(username, password, geeTest);
    userData.current = {
      username,
      password
    };
    if (result.userConfirmed === true) {
      await signIn(userData.current.username, userData.current.password);
      handleSuccess();
    } else {
      setCodeDelivery({
        type: result.codeDeliveryDetails.DeliveryMedium,
        destination: result.codeDeliveryDetails.Destination
      });
      setLoginState("confirm-sign-up");
    }
    return result;
  }, [handleSuccess, identity, signIn]);
  const confirmSignUp = useCallback(async (code) => {
    await identity.confirmSignUp(code);
    setLoginState("success-sign-up");
  }, [identity]);
  const confirmSignIn = useCallback(async (code) => {
    try {
      await identity.confirmSignIn(code, (codeDelivery == null ? void 0 : codeDelivery.type) === "SMS" ? "SMS_MFA" : "SOFTWARE_TOKEN_MFA");
      handleSuccess();
    } catch (e) {
      if (e && e.code === "NotAuthorizedException" && userData.current) {
        await signIn(userData.current.username, userData.current.password);
      } else {
        throw e;
      }
    }
  }, [codeDelivery, handleSuccess, identity, signIn]);
  const resendSignIn = useCallback(async () => {
    if (userData.current) {
      await signIn(userData.current.username, userData.current.password);
    }
  }, [signIn]);
  useEffect(() => {
    if (loginState !== "confirm-sign-up" && loginState !== "confirm-sign-in") {
      setCodeDelivery(void 0);
    }
  }, [loginState]);
  return /* @__PURE__ */ React__default.createElement(Box, {
    bg: "main.$800",
    width: "520px",
    borderRadius: "$6"
  }, /* @__PURE__ */ React__default.createElement(Flex, {
    height: 65,
    p: "20px 24px 20px 40px",
    borderBottom: "1px solid",
    borderColor: "#3a4050",
    mb: "32px",
    position: "relative"
  }, /* @__PURE__ */ React__default.createElement(Text, {
    as: "h2",
    fontSize: "17px",
    lineHeight: "24px",
    mb: "24px",
    color: "standard.$0",
    fontWeight: 500,
    margin: 0
  }, loginState === "sign-in" && "Log In", loginState === "sign-up" && "Create Account", loginState === "success-sign-up" && "Registration Successful", loginState === "forgot-password" && "Forgot Your Password?", loginState === "confirm-sign-up" && /* @__PURE__ */ React__default.createElement(Text, {
    ml: "10px"
  }, "Verify Your Account"), loginState === "confirm-sign-in" && /* @__PURE__ */ React__default.createElement(Text, {
    ml: "10px"
  }, "Verify Your Account"), loginState === "enable-2fa" && /* @__PURE__ */ React__default.createElement(Text, {
    ml: "10px"
  }, "Enable 2FA")), (loginState === "confirm-sign-up" || loginState === "confirm-sign-in") && /* @__PURE__ */ React__default.createElement(IconButton, {
    position: "absolute",
    top: 22,
    left: 22,
    size: 20,
    color: "basic.$700",
    _hover: { color: "basic.$500" },
    onClick: () => {
      if (loginState === "confirm-sign-up") {
        setLoginState("sign-up");
      }
      if (loginState === "confirm-sign-in") {
        setLoginState("sign-in");
      }
    }
  }, /* @__PURE__ */ React__default.createElement(Icon, {
    icon: iconExpandAccordion,
    size: 16,
    sx: { transform: "rotate(90deg)" }
  })), /* @__PURE__ */ React__default.createElement(IconButton, {
    ml: "auto",
    size: 25,
    color: "basic.$700",
    _hover: { color: "basic.$500" },
    onClick: onCloseClick
  }, /* @__PURE__ */ React__default.createElement(Icon, {
    icon: iconClose
  }))), loginState === "sign-in" && /* @__PURE__ */ React__default.createElement(SignInForm, {
    signUpEmail: (_a = userData.current) == null ? void 0 : _a.username,
    signIn,
    onForgotPasswordClick: () => {
      setLoginState("forgot-password");
    },
    onSignUpClick: () => {
      setLoginState("sign-up");
    }
  }), loginState === "sign-up" && /* @__PURE__ */ React__default.createElement(SignUpForm, {
    signUp,
    onSignInClick: () => {
      setLoginState("sign-in");
    },
    sendAnalytics
  }), loginState === "success-sign-up" && /* @__PURE__ */ React__default.createElement(RegistrationSuccessful, {
    onLogin: () => {
      setLoginState("sign-in");
    }
  }), loginState === "confirm-sign-up" && /* @__PURE__ */ React__default.createElement(CodeConfirmation, {
    codeDelivery,
    confirmCode: confirmSignUp,
    resendCode: resendSignUp
  }), loginState === "confirm-sign-in" && /* @__PURE__ */ React__default.createElement(CodeConfirmation, {
    codeDelivery,
    confirmCode: confirmSignIn,
    resendCode: (codeDelivery == null ? void 0 : codeDelivery.type) === "SMS" ? resendSignIn : void 0
  }), loginState === "forgot-password" && /* @__PURE__ */ React__default.createElement(ForgotPassword, {
    onSignInClick: () => {
      setLoginState("sign-in");
    },
    onSignUpClick: () => {
      setLoginState("sign-up");
    }
  }), loginState === "enable-2fa" && /* @__PURE__ */ React__default.createElement(Enable2FaComponent, {
    onClose: () => {
      handleSuccess();
    }
  }), loginState === "confirm-sign-up" || loginState === "confirm-sign-in" || loginState === "success-sign-up" || loginState === "forgot-password" || loginState === "enable-2fa" ? null : /* @__PURE__ */ React__default.createElement(Box, {
    pb: "32px",
    textAlign: "center",
    fontWeight: 300
  }, /* @__PURE__ */ React__default.createElement(Text, {
    variant: "footnote1",
    color: "basic.$500"
  }, "Waves.Exchange"), /* @__PURE__ */ React__default.createElement(Text, {
    variant: "footnote1",
    color: "basic.$700"
  }, " ", "provider is used.", " ")));
};
export { IdentityService, Login };
