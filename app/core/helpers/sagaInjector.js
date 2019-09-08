import { getAllSagaModes, isFunction, isString, isObject } from "@utils";

const SagaModes = getAllSagaModes();

const { DAEMON, ONCE_TILL_UNMOUNT, RESTART_ON_REMOUNT } = SagaModes;

const allowedModes = [RESTART_ON_REMOUNT, DAEMON, ONCE_TILL_UNMOUNT];

const checkDescriptor = ({ mode, saga }) => {
  if (!isFunction(saga)) {
    const e = new Error("Expected saga to be a generator.");
    throw e;
  }
  if (allowedModes.indexOf(mode) == -1) {
    const e = new Error(
      `Expected mode to be among ${RESTART_ON_REMOUNT}, ${DAEMON}, ${ONCE_TILL_UNMOUNT}`
    );
    throw e;
  }
  return true;
};

const validateName = name => {
  if (!isString(name)) {
    const e = new Error("Expected key to be a string/number.");
    throw e;
  }
};

const checkSagaExits = (name, injectedSagas) => {
  return Object.hasOwnProperty.call(injectedSagas, name);
};

export function injectSagaFactory(store) {
  return function injectSaga(name, { saga, mode = RESTART_ON_REMOUNT }) {
    checkDescriptor({ saga, mode });
    validateName(name);

    let hasSaga = checkSagaExits(name, store.injectedSagas);

    // if (process.env.NODE_ENV !== "production") {
    //   const oldDescriptor = store.injectedSagas[name];
    //   // enable hot reloading of daemon and once-till-unmount sagas
    //   if (hasSaga && oldDescriptor.saga !== saga) {
    //     oldDescriptor.task.cancel();
    //     hasSaga = false;
    //   }
    // }

    if (!hasSaga) {
      store.injectedSagas[name] = {
        saga,
        mode,
        task: store.runSaga(saga)
      };
    }
  };
}

export function ejectSagaFactory(store) {
  return function ejectSaga(name) {
    validateName(name);
    let hasSaga = checkSagaExits(name, store.injectedSagas);

    if (hasSaga) {
      const descriptor = store.injectedSagas[name];
      if (isObject(descriptor) && descriptor.mode !== DAEMON && descriptor.task) {
        descriptor.task.cancel();
        // Clean up in production; in development we need `descriptor.saga` for hot reloading
        if (process.env.NODE_ENV === "production") {
          // Need some value to be able to detect `ONCE_TILL_UNMOUNT` sagas in `injectSaga`
          store.injectedSagas[name] = "done";
        }
      }
    }
  };
}

export default function getSagaInjectors(store) {
  return {
    injectSaga: injectSagaFactory(store, true),
    ejectSaga: ejectSagaFactory(store, true)
  };
}
