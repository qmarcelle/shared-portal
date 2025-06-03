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
  modalType?: 'default' | 'alternate';
}
interface ModalControllerProps {
  showBack: boolean;
  showModal: boolean;
  pageIndex: number;
  store: null;
  isChildAction?: boolean;
  modalType?: 'default' | 'alternate';
  updateShowBack: (isShowBack: boolean) => void;
  updateshowModal: (isShowBack: boolean) => void;
  updatepageIndex: (pageIndex: number) => void;
  updateModalType: (type: 'default' | 'alternate') => void;
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
  modalType: 'default',

  updateShowBack: (isShowBack: boolean) => set({ showBack: isShowBack }),
  updateshowModal: (isShowModal: boolean) => set({ showModal: isShowModal }),
  updatepageIndex: (pageIndex: number) => set({ pageIndex }),
  updateStore: (store: null) => set({ store }),
  updateModalType: (type: 'default' | 'alternate') => set({ modalType: type }),

  isFlexModal: false,

  showAppModal: ({
    content,
    store,
    isChildActionAppModal,
    childModalContent,
    modalType = 'default',
  }: ModalProps) => {
    modalBody = content;
    childModalBody = childModalContent;

    set({
      modalType,
      showModal: true,
      store,
      isChildActionAppModalProp: !!isChildActionAppModal,
    });

    pageIndexStack = [0];
  },

  dismissModal: () => {
    set({
      showModal: false,
      store: null,
      showBack: false,
      pageIndex: 0,
      isChildModal: false,
      modalType: 'default',
    });
    modalBody = null;
  },

  showChildModal: () => set({ isChildModal: true }),
  dismissChildModal: () => set({ isChildModal: false }),
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
  className?: any;
  showFocusIcon?: boolean;
}

const ModalHeader = ({ onClose, showFocusIcon }: ModalHeaderProps) => {
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
          <Image src={leftIcon} className="modal-icon" alt="" />
          <TextBox text="Back" className="primary-color underline" />
        </Row>
      ) : (
        <div tabIndex={1} />
      )}

      <img
        src={bcbstSilhouletteLogo}
        className="modal-icon modal-header-logo absolute m-auto left-0 right-0"
        alt=""
      />
      <div
        tabIndex={0}
        className={`size-8 ${showFocusIcon ? 'focus-icon' : ''}`}
        onKeyDown={handleKeyDown}
        onClick={onClose}
      >
        <Image src={closeIcon} className="size-4" alt="" />
      </div>
    </Row>
  );
};

const ModalFooter = () => {
  return (
    <Row className="justify-center modal-footer">
      <Image src={bcbstSilhouletteLogo} className="modal-icon" alt="" />
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
    modalType,
  } = useAppModalStore();

  const changePage = (pageIndex: number, showBackButton: boolean = false) => {
    updateShowBack(showBackButton);
    updatepageIndex(pageIndex);
    pageIndexStack.push(pageIndex);
  };

  const closeModal = () => {
    isChildActionAppModalProp ? showChildModal() : dismissModal();
  };

  const closeChildModal = () => dismissChildModal();
  const closeAllModal = () => dismissModal();

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
        modalType={modalType}
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

  modalType?: 'default' | 'alternate';
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
  modalType = 'default',
}: InnerAppModalProps) => {
  const isAlternate = modalType === 'alternate';
  return (
    <>
      {!isAlternate ? (
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
                {!isFlexModal && (
                  <ModalHeader onClose={closeModal} showFocusIcon={true} />
                )}
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
      ) : (
        <Modal
          classNames={{
            overlay: 'modal-overlay',
            modal: `${isFlexModal ? '!bg-transparent' : ''} rounded-md`,
          }}
          showCloseIcon={false}
          open={showModal}
          closeOnOverlayClick={isFlexModal == false}
          onClose={closeModal}
          center={true}
        >
          <FocusTrap active={isFlexModal == false} className="card-main">
            <div className="w-full max-w-xl mx-auto">
              <Column className="flex-modal">
                <ModalHeader onClose={closeModal} showFocusIcon={false} />
                {modalBody ? (
                  React.cloneElement(modalBody, {
                    changePage,
                    pageIndex: pageIndex,
                  })
                ) : (
                  <div />
                )}

                {!isFlexModal && <Spacer size={32} />}
              </Column>
            </div>
          </FocusTrap>
        </Modal>
      )}
    </>
  );
};
