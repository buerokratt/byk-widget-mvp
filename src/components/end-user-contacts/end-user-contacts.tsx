import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { InputText } from "primereact/inputtext";
import useChatSelector from "../../hooks/use-chat-selector";
import { useAppDispatch } from "../../store";
import {
  AUTHOR_ROLES,
  CHAT_EVENTS,
  EMAIL_REGEX,
  PHONE_NR_REGEX,
  StyledButtonType,
} from "../../constants";
import {
  sendMessageWithNewEvent,
  setShowContactForm,
  setEmailAdress,
  setPhoneNumber,
  updateMessage,
} from "../../slices/chat-slice";
import { Message } from "../../model/message-model";
import StyledButton from "../styled-components/styled-button";

const EndUserContacts = (): JSX.Element => {
  const { endUserContacts, chatId, contactMsgId } = useChatSelector();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [invalidMessage, setInvalidMessage] = useState("");

  const validateInput = () => {
    if (!endUserContacts.phoneNr && !endUserContacts.mailAddress) {
      setInvalidMessage(t("widget.contacts.contact.invalid.fields"));
      return false;
    }

    if (!new RegExp(PHONE_NR_REGEX).test(endUserContacts.phoneNr)) {
      setInvalidMessage(t("widget.contacts.contact.invalid.phone"));
      return false;
    }

    if (!new RegExp(EMAIL_REGEX).test(endUserContacts.mailAddress)) {
      setInvalidMessage(t("widget.contacts.contact.invalid.email"));
      return false;
    }

    setInvalidMessage("");
    return true;
  };

  const declineForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newMsg: Message = {
      id: contactMsgId,
      chatId,
      authorRole: AUTHOR_ROLES.END_USER,
      authorTimestamp: new Date().toISOString(),
      content: "",
      event: CHAT_EVENTS.CONTACT_INFORMATION_REJECTED,
    };
    dispatch(updateMessage(newMsg));
    dispatch(sendMessageWithNewEvent(newMsg));
    dispatch(setShowContactForm(false));
  };

  const submitForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateInput()) {
      let message;
      if (endUserContacts.phoneNr && endUserContacts.mailAddress) {
        message = t("chatMessage.email-and-phone-template", {
          email: endUserContacts.mailAddress,
          phoneNr: endUserContacts.phoneNr,
        });
      } else if (endUserContacts.mailAddress)
        message = t("chatMessage.email-only-template", {
          email: endUserContacts.mailAddress,
        });
      else
        message = t("chatMessage.phone-only-template", {
          phoneNr: endUserContacts.phoneNr,
        });

      const newMsg: Message = {
        chatId,
        id: contactMsgId,
        authorRole: AUTHOR_ROLES.END_USER,
        authorTimestamp: new Date().toISOString(),
        content: message,
        event: CHAT_EVENTS.CONTACT_INFORMATION_FULFILLED,
      };
      dispatch(sendMessageWithNewEvent(newMsg));
      dispatch(setShowContactForm(false));
      newMsg.content = "";
    }
  };

  return (
    <EndUserContactsStyle>
      <form>
        <div className="container">
          <h3 className="form-header">{t("widget.contacts.contact.header")}</h3>
          {invalidMessage && (
            <p className="missing-feeback">{invalidMessage}</p>
          )}
          <div className="form-body">
            <div className="email-group">
              <h5> {t("widget.contacts.contact.mail.label")}</h5>
              <InputText
                id="email-input"
                className="email-input"
                placeholder={t("widget.contacts.contact.mail.placeholder")}
                pattern={EMAIL_REGEX}
                value={endUserContacts.mailAddress}
                onChange={(e) => dispatch(setEmailAdress(e.target.value))}
              />
            </div>
            <div className="phone-nr-group">
              <h5>{t("widget.contacts.contact.phone.label")}</h5>
              <InputText
                className="phone-nr-input"
                id="phone-nr-input"
                placeholder={t("widget.contacts.contact.phone.placeholder")}
                pattern={PHONE_NR_REGEX}
                value={endUserContacts.phoneNr}
                onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
              />
            </div>
          </div>
          <div className="form-footer">
            <StyledButton
              styleType={StyledButtonType.GRAY}
              onClick={(e) => declineForm(e)}
            >
              {t("widget.contacts.contact.close.label")}
            </StyledButton>
            <StyledButton
              styleType={StyledButtonType.GRAY}
              onClick={(e) => submitForm(e)}
            >
              {t("widget.contacts.contact.submit.label")}
            </StyledButton>
          </div>
        </div>
      </form>
    </EndUserContactsStyle>
  );
};

const EndUserContactsStyle = styled.div`
  height: 100%;

  input {
    border: 0;
    border-bottom: 1px solid #003cff;
    padding-bottom: 5px;
    width: 100%;
  }

  h5 {
    margin: 0.5rem 0 0 0;
  }

  .form-header {
    margin-bottom: 1rem;
  }

  .form-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 0.5rem;
  }

  form {
    height: 100%;
    width: 100%;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: -2rem;
  }

  .form-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: medium;

    .email-group {
      padding-bottom: 1rem;
      width: 100%;
    }

    .phone-nr-group {
      width: 100%;
    }

    .email-input:invalid,
    .phone-nr-input:invalid {
      border-color: #ff4800;
    }
  }

  .input-labels {
    display: flex;
    align-items: flex-start;
    justify-items: flex-start;
  }

  .missing-feeback {
    color: #ff4800;
    margin-bottom: -0.5em;
    font-size: 0.75rem;
  }
`;

export default EndUserContacts;
