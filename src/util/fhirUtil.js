import { string, object, boolean } from "yup";
import { formatDate } from "../util/dateUtil";
const validKeys = ["linkId", "text", "answer", "item"];

export const generateQuestionnaireResponse = (questionnaire, preFilledFields) => {
  let questionnaireResponse = {
    resourceType: "QuestionnaireResponse",
    status: "in-progress",
    authored: new Date(),
    item: questionnaire.item ? [...questionnaire.item] : [],
  };

  removeInvalidKeys(questionnaireResponse.item, preFilledFields);

  return questionnaireResponse;
};

export const removeInvalidKeys = (item, preFilledFields) => {
  item.forEach((item) => {
    let preFilledValue = "";
    if (preFilledFields && Object.keys(preFilledFields).includes(item.linkId)) {
      preFilledValue = preFilledFields[item.linkId];
    }
    setInitialAnswer(item, item.type, preFilledValue);
    Object.keys(item).forEach((key) => {
      if (!validKeys.includes(key)) delete item[key];
    });
    if (item.item) removeInvalidKeys(item.item, preFilledFields);
  });
};

export const setInitialAnswer = (item, type, preFilledValue) => {
  let initialValue = "";
  if (preFilledValue) {
    initialValue = preFilledValue;
  } else if (item.initial && item.initial[0] && item.initial[0].valueString) {
    initialValue = item.initial[0].valueString;
  }
  switch (type) {
    case "quantity":
      item["answer"] = [{ valueQuantity: { value: "", unit: "" } }];
      break;
    case "choice":
      item["answer"] = [{ valueCoding: { code: "", display: "" } }];
      break;
    case "decimal":
      item["answer"] = [{ valueDecimal: initialValue }];
      break;
    case "string":
      item["answer"] = [{ valueString: initialValue }];
      break;
    case "boolean":
      item["answer"] = [{ valueBoolean: false }];
      break;
    case "date":
      item["answer"] = [{ valueDate: initialValue }];
      break;
    case "text":
      item["answer"] = [{ valueString: initialValue }];
      break;
    default:
      break;
  }
};

export const findRelatedQuestion = (answerItem, question) => {
  if (!answerItem) return;
  for (let i = 0; i < question.item.length; i++) {
    for (let j = 0; j < question.item[i].item.length; j++) {
      if (question.item[i].item[j].linkId === answerItem.linkId) {
        return question.item[i].item[j];
      }
    }
  }
};

export const findRelatedQuestionGroup = (answerGroupItem, question) => {
  if (!answerGroupItem) return;
  for (let i = 0; i < question.item.length; i++) {
    if (question.item[i].linkId === answerGroupItem.linkId) {
      return question.item[i];
    }
  }
};

export const addAnother = (item, answer, setAnswer) => {
  answer = { ...answer, item: [...answer.item].reverse() };
  const idx = answer.item.findIndex((answer) => {
    return answer.linkId === item.linkId;
  });
  let clonedItem = JSON.parse(JSON.stringify(item));
  clonedItem.item.forEach((item) => {
    if (item.answer) item.answer = "";
  });
  answer.item.splice(idx, 0, { ...clonedItem });
  setAnswer({ ...answer, item: [...answer.item].reverse() });
};

export const removeLast = (item, answer, setAnswer) => {
  answer = { ...answer, item: [...answer.item].reverse() };
  const idx = answer.item.findIndex((answer) => {
    return answer.linkId === item.linkId;
  });
  answer.item.splice(idx, 1);
  setAnswer({ ...answer, item: [...answer.item].reverse() });
};

export const removeGroup = (grpIdx, answer, setAnswer) => {
  answer.item.splice(grpIdx, 1);
  setAnswer({ ...answer, item: [...answer.item] });
};

export const validate = (answer, page, question) => {
  let error = "";
  let length = answer.item.length;
  if (page != null && page >= 0) {
    length = page + 1;
  } else {
    page = 0;
  }
  for (let i = page; i < length; i++) {
    for (let j = 0; j < answer.item[i].item.length; j++) {
      //Note: Might need to increment 'page' for repeating item's validation
      const questionItem = findRelatedQuestion(answer.item[i].item[j], question);
      if (!questionItem.required || !isEnablerSatisfied(questionItem, answer)) continue;
      try {
        if (!answer.item[i].item[j].answer) continue;
        switch (Object.keys(answer.item[i].item[j].answer[0])[0]) {
          case "valueQuantity":
            object()
              .shape({ value: string().required("This field is required") })
              .validateSync(answer.item[i].item[j].answer[0].valueQuantity);
            break;
          case "valueCoding":
            if (answer.item[i].item[j].answer.length > 1) {
              object()
                .shape({ code: string().required("This field is required") })
                .validateSync(answer.item[i].item[j].answer[1].valueCoding);
            } else {
              object()
                .shape({ code: string().required("This field is required") })
                .validateSync(answer.item[i].item[j].answer[0].valueCoding);
            }
            break;
          case "valueDecimal":
            object()
              .shape({ valueDecimal: string().required("This field is required") })
              .validateSync(answer.item[i].item[j].answer[0]);
            break;
          case "valueString":
            object()
              .shape({ valueString: string().required("This field is required") })
              .validateSync(answer.item[i].item[j].answer[0]);
            break;
          case "valueBoolean":
            object()
              .shape({ valueBoolean: boolean().required("This field is required") })
              .validateSync(answer.item[i].item[j].answer[0]);
            break;
          case "valueText":
            object()
              .shape({ valueText: string().required("This field is required") })
              .validateSync(answer.item[i].item[j].answer[0]);
            break;
          case "valueDate":
            object()
              .shape({ valueDate: string().required("This field is required") })
              .validateSync(answer.item[i].item[j].answer[0]);
            break;
          default:
            break;
        }
      } catch (e) {
        error = { linkId: answer.item[i].item[j].linkId, error: e.message, answerGroupIdx: i, answerItemIdx: j };
        return error;
      }
    }
  }
  return null;
};

export const recurssiveValidate = (answers, questions) => {
  for (const answer of answers) {
    const questionItem = findRelatedQuestion(answer, questions);
    if (!questionItem.required || !isEnablerSatisfied(questionItem, answer)) continue;
    if (answer.answer && answer.answer[0]) {
      try {
        if (!answer.answer) continue;
        switch (Object.keys(answer.answer[0])[0]) {
          case "valueQuantity":
            object()
              .shape({ value: string().required("This field is required") })
              .validateSync(answer.answer[0].valueQuantity);
            break;
          case "valueCoding":
            if (answer.answer.length > 1) {
              object()
                .shape({ code: string().required("This field is required") })
                .validateSync(answer.answer[1].valueCoding);
            } else {
              object()
                .shape({ code: string().required("This field is required") })
                .validateSync(answer.answer[0].valueCoding);
            }
            break;
          case "valueDecimal":
            object()
              .shape({ valueDecimal: string().required("This field is required") })
              .validateSync(answer.answer[0]);
            break;
          case "valueString":
            object()
              .shape({ valueString: string().required("This field is required") })
              .validateSync(answer.answer[0]);
            break;
          case "valueBoolean":
            object()
              .shape({ valueBoolean: boolean().required("This field is required") })
              .validateSync(answer.answer[0]);
            break;
          case "valueText":
            object()
              .shape({ valueText: string().required("This field is required") })
              .validateSync(answer.answer[0]);
            break;
          case "valueDate":
            object()
              .shape({ valueDate: string().required("This field is required") })
              .validateSync(answer.answer[0]);
            break;
          default:
            break;
        }
      } catch (e) {
        const error = { linkId: answer.linkId, error: e.message };
        console.error(error);
        return error;
      }
    } else if (answer.item) {
      return recurssiveValidate(answer.item, questions);
    }
  }
  return { linkId: "", error: "" };
};

export const getValue = (answer, answerGroupIdx, answerItemIdx, code) => {
  if (!(answer && answer.item && answer.item.length > 0)) return "";
  switch (Object.keys(answer.item[answerGroupIdx].item[answerItemIdx].answer[0])[0]) {
    case "valueQuantity":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueQuantity.value;
    case "valueCoding":
      switch (code) {
        case "check-box":
          return answer.item[answerGroupIdx].item[answerItemIdx].answer;
        default:
          return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueCoding.code;
      }
    case "valueDecimal":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueDecimal;
    case "valueString":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueString;
    case "valueBoolean":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueBoolean;
    case "valueDate":
      return formatDate(answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueDate);
    default:
      return "N/A";
  }
};

export const getValueForPdf = (answer, answerGroupIdx, answerItemIdx, code) => {
  if (!(answer && answer.item && answer.item[answerGroupIdx].item[answerItemIdx].answer)) return "N/A";
  switch (Object.keys(answer.item[answerGroupIdx].item[answerItemIdx].answer[0])[0]) {
    case "valueQuantity":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueQuantity.value;
    case "valueCoding":
      switch (code) {
        case "check-box":
          return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueCoding;
        default:
          return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueCoding.display;
      }
    case "valueDecimal":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueDecimal;
    case "valueString":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueString;
    case "valueBoolean":
      return answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueBoolean;
    case "valueDate":
      return formatDate(answer.item[answerGroupIdx].item[answerItemIdx].answer[0].valueDate);
    default:
      return "N/A";
  }
};

export const getTotalQuestionsCount = (questions) => {
  let count = 0;
  if (questions && questions.item) {
    count = questions.item.length;
  }
  return count;
};

export const getAnsweredQuestionsCount = (answer, question, page) => {
  let count = 0;
  if (answer && answer.item) {
    // answer.item.forEach((item, index) => {
    //   if (!validate(answer, index)) count++;
    // });

    for (let i = 0; i < answer.item.length && i <= page; i++) {
      const error = recurssiveValidate(answer.item[i].item, question);
      if (!error.error) {
        count++;
        if (i > 0 && answer.item[i].linkId === answer.item[i - 1].linkId) {
          count--;
        }
      }
    }
  }
  return count;
};

const enablerOperators = {
  "=": (a, b) => {
    return a === b;
  },
  "!=": (a, b) => {
    return a !== b;
  },
};

export const isEnablerSatisfied = (question, answer) => {
  let isEnablerSatisfied;
  if (question && question.enableWhen && question.enableWhen.length > 0) {
    for (let i = 0; i < question.enableWhen.length; i++) {
      const enablerAnswer = getItemByLinkId(question.enableWhen[i].question, answer.item)?.answer[0];
      if (enablerAnswer) {
        switch (Object.keys(enablerAnswer)[0]) {
          case "valueString":
            if (
              enablerOperators[question.enableWhen[i].operator](
                enablerAnswer.valueString,
                question.enableWhen[i].answerString
              )
            )
              isEnablerSatisfied = true;
            else isEnablerSatisfied = false;
            break;
          case "valueDate":
            if (
              enablerOperators[question.enableWhen[i].operator](
                enablerAnswer.valueDate,
                question.enableWhen[i].answerDate
              )
            )
              isEnablerSatisfied = true;
            else isEnablerSatisfied = false;
            break;
          case "valueCoding":
            if (
              enablerOperators[question.enableWhen[i].operator](
                enablerAnswer.valueCoding.code,
                question.enableWhen[i].answerCoding?.code
              )
            )
              isEnablerSatisfied = true;
            else isEnablerSatisfied = false;
            break;
          case "valueBoolean":
            if (
              enablerOperators[question.enableWhen[i].operator](
                enablerAnswer.valueBoolean,
                question.enableWhen[i].answerBoolean
              )
            )
              isEnablerSatisfied = true;
            else isEnablerSatisfied = false;
            break;
          default:
            break;
        }
      }
      if (question.enableBehavior === "any" && isEnablerSatisfied === true) break;
      if (question.enableBehavior === "all" && isEnablerSatisfied === false) break;
    }
  } else {
    return true;
  }
  return isEnablerSatisfied;
};

export const getAnswerItemByLinkId = (linkId, answer) => {
  for (let grpIdx = 0; grpIdx < answer.item.length; grpIdx++) {
    if (!answer.item[grpIdx].item) continue;
    for (let itemIdx = 0; itemIdx < answer.item[grpIdx].item.length; itemIdx++) {
      if (linkId === answer.item[grpIdx].item[itemIdx].linkId) {
        return answer.item[grpIdx].item[itemIdx].answer[0];
      }
    }
  }
};

export const getItemByLinkId = (linkId, items) => {
  let item = null;
  if (!items || items.length <= 0) return;
  for (let i = 0; i < items.length; i++) {
    if (items[i] && items[i].linkId && items[i].linkId === linkId) {
      item = items[i];
      return item;
    }
    if (items[i].item && items[i].item.length > 0) {
      item = getItemByLinkId(linkId, items[i].item);
      if (item) return item;
    }
  }
  return item;
};
