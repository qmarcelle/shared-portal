import FocusTrap from 'focus-trap-react';
import React, { ReactElement, createContext } from 'react';
import { Modal } from 'react-responsive-modal';
import { create } from 'zustand';
import { IComponent } from '../IComponent';
import { Column } from './Column';
import { bcbstSilhouletteLogo } from './Icons';
import { Row } from './Row';
import { Spacer } from './Spacer';
import { TextBox } from './TextBox';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ModalProps extends IComponent {
  content: ReactElement & ModalChildProps;
  store?: any;
  isChildActionAppModal?: boolean;
  childModalContent?: ReactElement & ModalChildProps;
}
interface ModalControllerProps {
  showBack: boolean;
  showModal: boolean;
  pageIndex: number;
  store: null;
  isChildAction?: boolean;
  updateShowBack: (isShowBack: boolean) => void;
  updateshowModal: (isShowBack: boolean) => void;
  updatepageIndex: (pageIndex: number) => void;
  updateStore: (store: null) => void;
  showAppModal: (props: ModalProps) => void;
  dismissModal: () => void;
  isChildModal: boolean;
  showChildModal: () => void;
  dismissChildModal: () => void;
  isChildActionAppModalProp: boolean;
  isFlexModal: boolean;
}

export const useAppModalStore = create<ModalControllerProps>((set) => ({
  showBack: false,
  showModal: false,
  isChildModal: false,
  pageIndex: 0,
  store: null,
  isChildActionAppModalProp: false,
  updateShowBack: (isShowBack: boolean) =>
    set(() => ({ showBack: isShowBack })),
  updateshowModal: (isShowModal: boolean) =>
    set(() => ({ showModal: isShowModal })),
  updatepageIndex: (pageIndex: number) => set(() => ({ pageIndex: pageIndex })),
  updateStore: (store: null) => set(() => ({ store: store })),
  isFlexModal: false,
  showAppModal: ({
    content,
    store,
    isChildActionAppModal,
    childModalContent,
  }: ModalProps) => {
    modalBody = content;
    childModalBody = childModalContent;
    if (isChildActionAppModal) {
      set(() => ({
        isChildActionAppModalProp: isChildActionAppModal,
      }));
    }
    set(() => ({
      showModal: true,
    }));
    set(() => ({
      store: store,
    }));
    pageIndexStack = [0];
  },
  dismissModal: () => {
    set(() => ({
      showModal: false,
    }));
    set(() => ({
      store: null,
    }));
    set(() => ({
      showBack: false,
    }));
    set(() => ({
      pageIndex: 0,
    }));
    set(() => ({
      isChildModal: false,
    }));
    modalBody = null;
  },
  showChildModal: () => {
    set(() => ({
      isChildModal: true,
    }));
  },
  dismissChildModal: () => {
    set(() => ({
      isChildModal: false,
    }));
  },
}));
let modalBody: ReactElement | null = null;
let childModalBody: ReactElement | null | undefined = null;
let pageIndexStack: number[] = [];
export interface ModalChildProps {
  changePage?: (pageIndex: number, showBackButton?: boolean) => any;
  pageIndex?: number;
}

export const ModalContext = createContext<any>(null);

interface ModalHeaderProps {
  onClose: () => any;
}

const ModalHeader = ({ onClose }: ModalHeaderProps) => {
  const { updatepageIndex, updateShowBack, pageIndex, showBack } =
    useAppModalStore();
  const onBackPressed = () => {
    pageIndexStack.pop();
    const popIndex = pageIndexStack[pageIndexStack.length - 1];
    updatepageIndex(popIndex ?? 0);
    if (pageIndex == 0) {
      updateShowBack(false);
    }
  };

  const handleKeyDown = (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      onClose();
    }
  };

  return (
    <Row className="justify-between modal-header items-center relative">
      {showBack ? (
        <Row
          tabIndex={1}
          onClick={onBackPressed}
          className="items-center focus-icon"
        >
          <img src="/assets/left.svg" className="modal-icon" alt="back" />
          <TextBox text="Back" className="primary-color underline" />
        </Row>
      ) : (
        <div tabIndex={1} />
      )}

      <img
        src={bcbstSilhouletteLogo}
        className="modal-icon modal-header-logo absolute m-auto left-0 right-0"
        alt="bcbst logo"
      />
      <div
        tabIndex={0}
        className="size-8 focus-icon"
        onKeyDown={handleKeyDown}
        onClick={onClose}
      >
        <img src="/assets/close.svg" className="size-4" alt="close" />
      </div>
    </Row>
  );
};

const ModalFooter = () => {
  return (
    <Row className="justify-center modal-footer">
      <img src={bcbstSilhouletteLogo} className="modal-icon" alt="bcbst logo" />
    </Row>
  );
};

export const AppModal = () => {
  const {
    dismissModal,
    updateShowBack,
    updatepageIndex,
    store,
    showModal,
    pageIndex,
    isChildModal,
    showChildModal,
    dismissChildModal,
    isChildActionAppModalProp,
    isFlexModal,
  } = useAppModalStore();
  const changePage = (pageIndex: number, showBackButton: boolean = false) => {
    updateShowBack(showBackButton);
    updatepageIndex(pageIndex);
    pageIndexStack.push(pageIndex);
  };
  const closeModal = () => {
    isChildActionAppModalProp ? showChildModal() : dismissModal();
  };

  const closeChildModal = () => {
    dismissChildModal();
  };
  const closeAllModal = () => {
    dismissModal();
  };
  return (
    <ModalContext.Provider value={store}>
      <InnerAppModal
        isFlexModal={isFlexModal}
        showModal={showModal}
        modalBody={modalBody}
        changePage={changePage}
        pageIndex={pageIndex}
        closeModal={closeModal}
        isChildModal={isChildModal}
        closeChildModal={closeChildModal}
        closeAllModal={closeAllModal}
        childModalBody={childModalBody ?? <></>}
      />
    </ModalContext.Provider>
  );
};

type InnerAppModalProps = {
  showModal?: boolean;
  closeModal?: () => any;
  modalBody: ReactElement | null;
  changePage?: (pageIndex: number, showBackButton: boolean) => any;
  pageIndex?: number;
  isChildModal?: boolean;
  closeChildModal?: () => any;
  closeAllModal?: () => any;
  childModalBody?: ReactElement;
  isFlexModal: boolean;
};

export const InnerAppModal = ({
  showModal = true,
  closeModal = () => {},
  modalBody,
  changePage = () => {},
  pageIndex = 0,
  isChildModal = false,
  childModalBody,
  isFlexModal,
}: InnerAppModalProps) => {
  return (
    <Modal
      classNames={{
        overlay: 'modal-overlay',
        modal: `${isFlexModal ? '!bg-transparent' : ''}`,
      }}
      showCloseIcon={false}
      open={showModal}
      closeOnOverlayClick={isFlexModal == false}
      onClose={closeModal}
      center={true}
    >
      <FocusTrap active={isFlexModal == false}>
        <div>
          <Column
            className={`${!isFlexModal ? 'modal-container' : 'flex-modal'}`}
          >
            {!isFlexModal && <ModalHeader onClose={closeModal} />}
            {!isFlexModal && <Spacer size={32} />}
            <div className="flex flex-row flex-grow justify-center">
              <div className="flex flex-row justify-center modal-content">
                {modalBody ? (
                  React.cloneElement(modalBody, {
                    changePage,
                    pageIndex: pageIndex,
                  })
                ) : (
                  <div />
                )}
              </div>
            </div>
            {isChildModal && (
              <div className="child-modal">
                <div className="child-modal-content">{childModalBody}</div>
              </div>
            )}
            {!isFlexModal && <Spacer size={32} />}
            {!isFlexModal && <ModalFooter />}
          </Column>
        </div>
      </FocusTrap>
    </Modal>
  );
};
