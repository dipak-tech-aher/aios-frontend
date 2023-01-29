import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Pagination = ({ pageData: { currentPage, totalPages }, setPageData }) => {
  const { t } = useTranslation();
  return totalPages <= 1 ? (
    ""
  ) : (
    <nav max-size="5">
      <ul className="pagination" style={{ justifyContent: "flex-end" }}>
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <Link
            className="page-link"
            to="#"
            onClick={() => {
              setPageData((prevState) => {
                return { ...prevState, currentPage: 1 };
              });
            }}
          >
            {t("First")}
          </Link>
        </li>
        <li className={currentPage === 1 ? "page-item disabled" : "page-item"}>
          <Link
            className="page-link"
            to="#"
            onClick={() => {
              setPageData((prevState) => {
                return { ...prevState, currentPage: prevState.currentPage - 1 };
              });
            }}
          >
            <img
              src={require("../assets/images/ic-arrow-left-inactive.svg")}
              alt="icon"
              style={{ marginTop: "-5px" }}
            />
          </Link>
        </li>
        {[...Array(totalPages)].map((item, idx) => {
          return (
            <Fragment key={idx}>
              {!(idx + 1 < currentPage - 5 || idx + 1 > currentPage + 5) ||
              (idx + 1 <= 11 && currentPage <= 5) ||
              (idx + 1 >= totalPages - 10 && currentPage >= totalPages - 5) ? (
                <li style={{ width: "40px" }} className={currentPage === idx + 1 ? "page-item active" : "page-item"}>
                  <Link
                    className="page-link"
                    to="#"
                    onClick={() => {
                      setPageData((prevState) => {
                        return { ...prevState, currentPage: idx + 1 };
                      });
                    }}
                  >
                    {idx + 1}
                  </Link>
                </li>
              ) : (
                ""
              )}
            </Fragment>
          );
        })}
        <li className={currentPage === totalPages ? "page-item disabled" : "page-item"}>
          <Link
            className="page-link"
            to="#"
            onClick={() => {
              setPageData((prevState) => {
                return { ...prevState, currentPage: prevState.currentPage + 1 };
              });
            }}
          >
            <img src={require("../assets/images/ic-arrow-right.svg")} alt="icon" style={{ marginTop: "-5px" }} />
          </Link>
        </li>
        <li className={currentPage === totalPages ? "page-item disabled" : "page-item"}>
          <Link
            className="page-link"
            to="#"
            onClick={() => {
              setPageData((prevState) => {
                return { ...prevState, currentPage: totalPages };
              });
            }}
          >
            {t("Last")}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
