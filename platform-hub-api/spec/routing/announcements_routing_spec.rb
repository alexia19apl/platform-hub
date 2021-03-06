require 'rails_helper'

RSpec.describe AnnouncementsController, type: :routing do
  describe 'routing' do

    context 'with announcements feature flag enabled' do

      before do
        FeatureFlagService.create_or_update(:announcements, true)
      end

      it 'routes to #index' do
        expect(:get => '/announcements').to route_to('announcements#index')
      end

      it 'routes to #global' do
        expect(:get => '/announcements/global').to route_to('announcements#global')
      end

      it 'routes to #show' do
        expect(:get => '/announcements/1').to route_to('announcements#show', :id => '1')
      end

      it 'routes to #create' do
        expect(:post => '/announcements').to route_to('announcements#create')
      end

      it 'routes to #update via PUT' do
        expect(:put => '/announcements/1').to route_to('announcements#update', :id => '1')
      end

      it 'routes to #update via PATCH' do
        expect(:patch => '/announcements/1').to route_to('announcements#update', :id => '1')
      end

      it 'routes to #destroy' do
        expect(:delete => '/announcements/1').to route_to('announcements#destroy', :id => '1')
      end

      it 'routes to #mark_sticky' do
        expect(:post => '/announcements/1/mark_sticky').to route_to('announcements#mark_sticky', :id => '1')
      end

      it 'routes to #unmark_sticky' do
        expect(:post => '/announcements/1/unmark_sticky').to route_to('announcements#unmark_sticky', :id => '1')
      end

      it 'routes to #resend' do
        expect(:post => '/announcements/1/resend').to route_to('announcements#resend', :id => '1')
      end

    end

    context 'with announcements feature flag disabled' do

      before do
        FeatureFlagService.create_or_update(:announcements, false)
      end

      it 'route to #index is not routable' do
        expect(:get => '/announcements').to_not be_routable
      end

      it 'route to #global is not routable' do
        expect(:get => '/announcements/global').to_not be_routable
      end

      it 'route to #show is not routable' do
        expect(:get => '/announcements/1').to_not be_routable
      end

      it 'route to #create is not routable' do
        expect(:post => '/announcements').to_not be_routable
      end

      it 'route to #update via PUT is not routable' do
        expect(:put => '/announcements/1').to_not be_routable
      end

      it 'route to #update via PATCH is not routable' do
        expect(:patch => '/announcements/1').to_not be_routable
      end

      it 'route to #destroy is not routable' do
        expect(:delete => '/announcements/1').to_not be_routable
      end

      it 'route to #mark_sticky is not routable' do
        expect(:post => '/announcements/1/mark_sticky').to_not be_routable
      end

      it 'route to #unmark_sticky is not routable' do
        expect(:post => '/announcements/1/unmark_sticky').to_not be_routable
      end

      it 'route to #resend is not routable' do
        expect(:post => '/announcements/1/resend').to_not be_routable
      end

    end

  end
end
