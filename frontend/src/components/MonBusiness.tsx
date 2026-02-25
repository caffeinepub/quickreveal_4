import React from 'react';
import ProLayout from './ProLayout';

// MonBusiness now delegates to ProLayout which contains the full pro space
// with ProContext, tab navigation, and BusinessScreen with sub-tabs.
export default function MonBusiness() {
  return <ProLayout />;
}
