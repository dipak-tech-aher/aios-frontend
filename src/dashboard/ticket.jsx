import React, { useEffect, useState } from "react";
import { get } from "../util/restUtil";
import { properties } from "../properties";

const Faq = () => {
  const [faqContent, setFaqContent] = useState([]);

  useEffect(() => {
    get(properties.FAQ_API).then(resp => {
      if (resp && resp.data && resp.data.length > 0) {
        setFaqContent(resp.data);
      }
    });
  }, []);

  return (
    <form style={{ width: "100%" }}>
      {faqContent
        ? faqContent.map(question => {
            return (
              <div className="col-md-12" key={question.id}>
                <div className="panel-group" id={"faqaccordian" + question.id}>
                  <div className="panel panel-default news-list">
                    <div className="panel-heading">
                      <h3>
                        <a
                          className="accordion-toggle"
                          data-toggle="collapse"
                          data-parent={"#faqaccordian" + question.id}
                          href={"#faqcollapse" + question.id}
                          aria-expanded="true"
                        >
                          {question.Question} <span className="show"></span>
                        </a>
                      </h3>
                    </div>
                    <div id={"faqcollapse" + question.id} className="panel-collapse in collapse">
                      <div className="panel-body">
                        <p>{question.Answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        : ""}
    </form>
  );
};

export default Faq;
