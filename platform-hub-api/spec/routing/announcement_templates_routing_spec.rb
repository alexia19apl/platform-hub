require 'rails_helper'

RSpec.describe AnnouncementTemplatesController, type: :routing do
  describe 'routing' do

    context 'with announcements feature flag enabled' do

      before do
        FeatureFlagService.create_or_update(:announcements, true)
      end

      it 'routes to #index' do
        expect(:get => '/announcement_templates').to route_to('announcement_templates#index')
      end

      it 'routes to #show' do
        expect(:get => '/announcement_templates/1').to route_to('announcement_templates#show', :id => '1')
      end

      it 'routes to #create' do
        expect(:post => '/announcement_templates').to route_to('announcement_templates#create')
      end

      it 'routes to #update via PUT' do
        expect(:put => '/announcement_templates/1').to route_to('announcement_templates#update', :id => '1')
      end

      it 'routes to #update via PATCH' do
        expect(:patch => '/announcement_templates/1').to route_to('announcement_templates#update', :id => '1')
      end

      it 'routes to #destroy' do
        expect(:delete => '/announcement_templates/1').to route_to('announcement_templates#destroy', :id => '1')
      end

      it 'routes to #form_field_types' do
        expect(:get => '/announcement_templates/form_field_types').to route_to('announcement_templates#form_field_types')
      end

      it 'routes to #preview' do
        expect(:post => '/announcement_templates/preview').to route_to('announcement_templates#preview')
      end

    end

    context 'with announcements feature flag disabled' do

      before do
        FeatureFlagService.create_or_update(:announcements, false)
      end

      it 'routes to #index' do
        expect(:get => '/announcement_templates').to_not be_routable
      end

      it 'routes to #show' do
        expect(:get => '/announcement_templates/1').to_not be_routable
      end

      it 'routes to #create' do
        expect(:post => '/announcement_templates').to_not be_routable
      end

      it 'routes to #update via PUT' do
        expect(:put => '/announcement_templates/1').to_not be_routable
      end

      it 'routes to #update via PATCH' do
        expect(:patch => '/announcement_templates/1').to_not be_routable
      end

      it 'routes to #destroy' do
        expect(:delete => '/announcement_templates/1').to_not be_routable
      end

      it 'routes to #form_field_types' do
        expect(:get => '/announcement_templates/form_field_types').to_not be_routable
      end

      it 'routes to #preview' do
        expect(:post => '/announcement_templates/preview').to_not be_routable
      end

    end

  end
end
