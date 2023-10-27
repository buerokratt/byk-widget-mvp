import { EMAIL_REGEX, PHONE_NR_REGEX } from '../../constants';

const emailRegex = new RegExp(EMAIL_REGEX);
const phoneRegex = new RegExp(PHONE_NR_REGEX);

describe('regex', () => {
  describe('email', () => {
    it.each`
      correctMail
      ${'username@domain.com'}
      ${'email@gmail.com'}
      ${'test@test.test'}
      ${'test@domain.com'}
      ${''}
      ${'test@domain.co.uk'}
      ${'lastname@domain.com'}
      ${'test@testä.com'}
      ${'märt@kärn.gmail.com'}
      ${'test.email.with+symbol@domain.com'}
    `("should accept email '$correctMail", async ({ correctMail }) => {
      emailRegex.test(correctMail);
      expect(emailRegex.test(correctMail)).toBeTruthy();
    });

    it.each`
      incorrectMail
      ${'use@123-com'}
      ${'usernamedomain.com'}
      ${'username@domaincom'}
      ${'A@b@c@domain.com'}
      ${'test@मोहन.ईन्फो'}
      ${'test@127.0.0.1'}
      ${'test'}
      ${'test@test'}
      ${'abcis”not\valid@domain.com'}
      ${'a”b(c)d,e:f;gi[jk]l@domain.com'}
    `("should reject false email '$incorrectMail", async ({ incorrectMail }) => {
      emailRegex.test(incorrectMail);
      expect(emailRegex.test(incorrectMail)).toBeFalsy();
    });
  });
  describe('phone number', () => {
    it.each`
      correctPhoneNr
      ${'12345678'}
      ${'372 1234567'}
      ${'372-1234567'}
      ${''}
      ${'372 12345678'}
      ${'372-12345678'}
      ${'1234567'}
    `("should accept number: '$correctPhoneNr'", async ({ correctPhoneNr }) => {
      expect(phoneRegex.test(correctPhoneNr)).toBeTruthy();
    });

    it.each`
      inCorrectPhoneNr
      ${'abc'}
      ${'1234s67'}
      ${'12345678901234567890'}
    `("should reject incorrect number: '$inCorrectPhoneNr'", async ({ inCorrectPhoneNr }) => {
      expect(phoneRegex.test(inCorrectPhoneNr)).toBeFalsy();
    });
  });
});
