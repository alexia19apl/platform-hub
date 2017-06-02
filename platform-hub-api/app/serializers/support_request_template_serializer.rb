class SupportRequestTemplateSerializer < BaseSerializer
  attributes(
    :id,
    :shortname,
    :git_hub_repo,
    :title,
    :description,
    :user_scope,
    :created_at,
    :updated_at
  )

  attributes :form_spec
  attributes :git_hub_issue_spec

  def id
    object.friendly_id
  end
end
