import React from "react";
import { useTranslation } from 'react-i18next';

const NoData = () => {
  const { t } = useTranslation();
  return (
    <div style={{
      textAlign: 'left', paddingLeft: '40px'
    }}>
      {t('No_results_available_for_display')}
    </div>
  );
}

export default NoData