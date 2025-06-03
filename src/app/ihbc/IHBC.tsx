import { MemberData } from '@/actions/loggedUserInfo';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DependentsContext } from './providers/dependentsProvider';
import { ImpersonatingContext } from './providers/impersonatingProvider';
import { LoggedInMemberContext } from './providers/loggedInMemberProvider';
import { IHBCSchema, ihbcSchema } from './rules/schema';
import { useNavigationStore } from './stores/navigationStore';

type Props = {
  loggedInMember: LoggedInMember;
  members: MemberData[];
  isImpersonating: boolean;
};

export const IHBC = ({ isImpersonating, loggedInMember, members }: Props) => {
  const methods = useForm<IHBCSchema>({
    resolver: zodResolver(ihbcSchema),
    mode: 'onTouched',
  });
  const [currentPagePointer, getCurrentPage] = useNavigationStore((state) => [
    state.currentPagePointer,
    state.getCurrentPage,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentPagePointer]);

  const CurrentPage = getCurrentPage();

  return (
    <DependentsContext.Provider value={{ members, setMembers: () => {} }}>
      <LoggedInMemberContext.Provider value={loggedInMember}>
        <ImpersonatingContext.Provider value={isImpersonating}>
          <FormProvider {...methods}>{CurrentPage}</FormProvider>
        </ImpersonatingContext.Provider>
      </LoggedInMemberContext.Provider>
    </DependentsContext.Provider>
  );
};
