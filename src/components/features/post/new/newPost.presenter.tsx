import { Divider, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import * as S from './newPost.styles'
import { MyButton } from '@/components/common/customComponent.styles'
import { NewPostUIProps } from './newPost.types'

export default function NewPostUI(props: NewPostUIProps) {
  return (
    <S.Container>
      <S.TitleWrapper>
        <S.Title>새 포스트 작성</S.Title>
      </S.TitleWrapper>

      <S.PostForm onFinish={props.handleSubmitForm}>
        <Form.Item name="title" rules={[{ required: props.post.title ? false : true, message: '제목을 적어주세요.' }]}>
          <Input type="primary" placeholder="제목" defaultValue={props.post ? props.post.title : ''} />
        </Form.Item>

        <Form.Item name="tags" rules={[{ required: props.post.tags ? false : true, message: '태그를 정해주세요.' }]}>
          <Select
            mode="multiple"
            placeholder="태그를 정해주세요."
            defaultValue={props.post ? props.post.tags : null}
            allowClear
            onSearch={props.handleSearchChange}
            dropdownRender={menu => (
              <>
                {menu}
                {props.isAddTagOptionVisible ? (
                  <>
                    <Divider style={{ margin: '0.5rem 0' }} />
                    <div style={{ padding: '0 0.5rem 0.25rem' }}>
                      <MyButton type="text" icon={<PlusOutlined />} onClick={props.handleClickAddTag}>
                        #{props.searchString} 추가하기
                      </MyButton>
                    </div>
                  </>
                ) : null}
              </>
            )}
            options={props.tags.map(tag => ({ label: `#${tag}`, value: tag }))}
          />
        </Form.Item>

        <Form.Item>
          <props.DynamicImportEditor
            editorRef={props.editorRef}
            content={props.post ? props.post.contentMarkdown : ''}
          />
        </Form.Item>

        <Form.Item>
          <S.ButtonWrapper>
            <MyButton type="primary" htmlType="submit">
              포스트 저장하기
            </MyButton>
          </S.ButtonWrapper>
        </Form.Item>
      </S.PostForm>
    </S.Container>
  )
}
