import { postItem } from '@/common/dummyData/post'
import * as S from './postDetail.styles'
import PostAnswerList from '../../post-answer/liat/postAnswerList.container'
import PostAnswerWrite from '../../post-answer/write/postAnswerWrite.container'
import { MyTag } from '@/components/common/customComponent.styles'
import { useMoveToPage } from '@/common/hooks/useMoveToPage'

export default function PostDetailUI() {
  const { onClickMoveToPage } = useMoveToPage()

  return (
    <S.Container>
      {/* 포스트 본문 */}
      <div>
        <S.PostTitle>{postItem[0].title}</S.PostTitle>
        <S.PostSubTitle>부제목</S.PostSubTitle>
        <S.PostTagWapper>
          <MyTag isChecked={true}>태그</MyTag>
          <MyTag isChecked={true}>태그</MyTag>
          <MyTag isChecked={true}>태그</MyTag>
          <MyTag isChecked={true}>태그</MyTag>
        </S.PostTagWapper>

        <S.Header>
          <S.AvatarWrapper>
            <S.Avatar src="/images/avatar.png" />
            <S.Info>
              <S.Writer>{postItem[0].name}</S.Writer>
              <S.CreatedAt>{postItem[0].createDate}</S.CreatedAt>
            </S.Info>
          </S.AvatarWrapper>
          <S.PostUpdateBtnWrapper>
            <button onClick={onClickMoveToPage('/post/stats')}>통계</button>
            <button onClick={onClickMoveToPage('/post/12312/edit')}>수정</button>
            <button>삭제</button>
          </S.PostUpdateBtnWrapper>
        </S.Header>

        <S.ImageWrapper>
          <S.Image src={postItem[0].image} />
        </S.ImageWrapper>
        <div>{postItem[0].contents}</div>

        <S.LikeWrapper>
          <S.Like>
            <img src="/images/heart-outlined.svg" />
          </S.Like>
        </S.LikeWrapper>
      </div>
      {/* 포스트 댓글 */}
      <PostAnswerList />
      <PostAnswerWrite />
    </S.Container>
  )
}
