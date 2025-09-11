'use client';

import { useState } from 'react';
import { nicknameCheckApi } from '@libs/api_front/nicknameCheck.api';

export function useNicknameCheck() {
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const [checking, setChecking] = useState(false);

  const checkNickname = async (nickname: string) => {
    if (!nickname) {
      setNicknameCheckMessage('닉네임을 입력하세요.');
      return;
    }

    setChecking(true);
    try {
      const data = await nicknameCheckApi.checkNickname(nickname);

      if (data.available) {
        setNicknameChecked(true);
        setNicknameCheckMessage('사용 가능한 닉네임입니다.');
      } else {
        setNicknameChecked(false);
        setNicknameCheckMessage('이미 사용 중인 닉네임입니다.');
      }
    } catch (error) {
      setNicknameChecked(false);
      setNicknameCheckMessage('중복 확인 중 오류 발생');
    } finally {
      setChecking(false);
    }
  };

  const resetCheck = () => {
    setNicknameChecked(false);
    setNicknameCheckMessage('');
  };

  return {
    nicknameChecked,
    nicknameCheckMessage,
    checking,
    checkNickname,
    resetCheck,
  };
}
