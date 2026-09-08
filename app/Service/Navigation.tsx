import {
  StackActions,
  CommonActions,
  StackActionType,
} from '@react-navigation/native';

let _navigator: {
  dispatch: (arg0: CommonActions.Action | StackActionType) => void;
};

function setTopLevelNavigator(r: {
  dispatch: (arg0: CommonActions.Action | StackActionType) => void;
}) {
  _navigator = r;
}

function navigate(routeName: any, params: any) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params,
    }),
  );
}

function replace(routeName: any, params?: any) {
  _navigator.dispatch(
    StackActions.replace(routeName, params),
  );
}

function back() {
  _navigator.dispatch(CommonActions.goBack());
}

export default {
  navigate,
  setTopLevelNavigator,
  back,
  replace,
};
