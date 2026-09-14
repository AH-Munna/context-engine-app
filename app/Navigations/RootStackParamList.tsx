export type RootStackParamList = {
  // Auth & Onboarding
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ChooseAccountType: undefined;
  CreatorOnboarding: undefined;
  OrgOnboarding: {initialName?: string} | undefined;

  // Main App
  Home: undefined;
  Profile: undefined;
  Marketplace: undefined;
  Campaigns: undefined;
  Portfolio: undefined;
  BrandProfiles: undefined;
  TeamProjects: undefined;
  Approvals: undefined;
  Components: undefined;

  // Reusable Component Showcases
  Accordion: undefined;
  ActionSheet: undefined;
  ActionModals: undefined;
  Buttons: undefined;
  Charts: undefined;
  Chips: undefined;
  Cards: undefined;
  Columns: undefined;
  CollapseElements: undefined;
  DividerElements: undefined;
  FileUploads: undefined;
  Headers: undefined;
  Footers: undefined;
  TabStyle1: undefined;
  TabStyle2: undefined;
  TabStyle3: undefined;
  TabStyle4: undefined;
  Inputs: undefined;
  lists: undefined;
  Paginations: undefined;
  Pricings: undefined;
  CarouselSliders: undefined;
  Snackbars: undefined;
  Socials: undefined;
  Swipeable: undefined;
  Tabs: undefined;
  Tables: undefined;
  Toggles: undefined;
  SystemPage: undefined;
};