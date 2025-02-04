import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, Linking } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HeaderBack from '../Common/HeaderBack';
import ScreenBackground from '../Common/ScreenBackground';
import { theme } from '../theme';
import Button from '../Common/Button';
import CountdownCard from '../Common/CountdownCard';
import { NavigationStackOptions, NavigationStackScreenProps } from 'react-navigation-stack';
import Launch, { Links } from '../Models/Launch';
import RocketDetailsCard from './RocketDetailsCard';
import PushableWrapper from '../Common/PushableWrapper';

const Wrapper = styled(ScreenBackground)`
  flex: 1;
`;

const DetailsWrapper = styled.View`
  background: ${theme.colors.cardBackground};
  margin: 25px;
  border-radius: 20px;
  padding: 20px;
  overflow: hidden;
  flex: 1;
  justify-content: flex-end;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 80%;
  height: 100%;
  top: 15px;
  align-self: center;
  opacity: 0.2;
`;

const ContentWrapper = styled(SafeAreaView)`
  flex: 1;
`;

const SectionTitle = styled.Text`
  color: white;
  font-weight: bold;
`;

const LaunchStatus = styled.Text<{ status: boolean }>`
  color: ${({ status }) => (status ? '#408e41' : '#b73131')};
  font-weight: bold;
  margin-bottom: 15px;
`;

const InfoText = styled.Text`
  color: white;
  font-size: 16px;
  margin-bottom: 15px;
  margin-left: 5px;
`;

const DescText = styled.Text`
  color: white;
  text-align: justify;
  margin: 25px;
`;

const LinksWrapper = styled.View`
  margin: 20px 20px 10px;
`;

const ShuttleIcon = styled(Icon)`
  align-self: center;
`;

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const LinkButton = styled(Button)`
  width: 80%;
`;

const ButtonLabel = styled.Text`
  color: #bbb;
  margin: 3px;
`;

const ButtonWrapper = styled.View`
  flex: 1;
  align-items: center;
`;

type Params = {
  data: Launch;
};
type Props = {};
type State = {
  rocketDetailsExpanded: boolean;
};
class LaunchDetailsScreen extends React.Component<NavigationStackScreenProps<Params, Props>, State> {
  static navigationOptions: NavigationStackOptions = {
    header: null
  };
  private scrollView: ScrollView;

  constructor(props) {
    super(props);
    this.state = { rocketDetailsExpanded: false };
  }

  navigateToLinks(links: Links) {
    this.props.navigation.navigate('links', { links });
  }

  navigateToGallery(links: Links) {
    this.props.navigation.navigate('gallery', { links: links.flickr_images });
  }

  toggleRocketDetails() {
    this.setState({ rocketDetailsExpanded: !this.state.rocketDetailsExpanded });
    setTimeout(() => this.scrollView.scrollToEnd(), 100);
  }

  render() {
    const { navigation } = this.props;
    const data = navigation.getParam('data', new Launch());
    const utcDate = new Date(data.launch_date_utc).toUTCString();
    const fireTestUTC = new Date(data.static_fire_date_utc).toUTCString();
    const { rocketDetailsExpanded } = this.state;
    return (
      <Wrapper>
        <ContentWrapper>
          <HeaderBack screenTitle={data.mission_name} navigateBack={() => this.props.navigation.goBack()} />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            ref={scrollView => {
              this.scrollView = scrollView;
            }}
          >
            <DetailsWrapper>
              <BackgroundImage resizeMode="contain" source={{ uri: data.links.mission_patch_small }} />
              <LaunchStatus status={data.launch_success}>{data.launch_success ? 'Successful' : 'Failed'}</LaunchStatus>
              <SectionTitle>Rocket</SectionTitle>
              <InfoText>{data.rocket.rocket_name}</InfoText>
              <SectionTitle>Launch site</SectionTitle>
              <InfoText>{data.launch_site.site_name_long}</InfoText>
              <SectionTitle>Time</SectionTitle>
              <InfoText>{utcDate}</InfoText>
              <SectionTitle>Local launch time</SectionTitle>
              <InfoText>{data.launch_date_local}</InfoText>
            </DetailsWrapper>
            <ShuttleIcon name="space-shuttle" size={28} color="#eee" />
            <DescText>{data.details}</DescText>
            <DescText>Static Fire Test Date: {fireTestUTC}</DescText>
            <CountdownCard timestamp={data.launch_date_unix} />
            <LinksWrapper>
              <Row>
                <ButtonWrapper>
                  <LinkButton
                    icon="youtube"
                    type="red"
                    disabled={!data.links.video_link}
                    onPress={() => Linking.openURL(data.links.video_link)}
                  />
                  <ButtonLabel>Livestream</ButtonLabel>
                </ButtonWrapper>
                <ButtonWrapper>
                  <LinkButton icon="newspaper" type="blue" onPress={() => this.navigateToLinks(data.links)} />
                  <ButtonLabel>Links</ButtonLabel>
                </ButtonWrapper>

                {data.links.flickr_images && (
                  <ButtonWrapper>
                    <LinkButton icon="rocket" type="fire" onPress={() => this.navigateToGallery(data.links)} />
                    <ButtonLabel>Gallery</ButtonLabel>
                  </ButtonWrapper>
                )}
              </Row>
            </LinksWrapper>
            <PushableWrapper style={{ flex: 1 }} onPress={() => this.toggleRocketDetails()}>
              <RocketDetailsCard data={data.rocket} expanded={rocketDetailsExpanded} />
            </PushableWrapper>
          </ScrollView>
        </ContentWrapper>
      </Wrapper>
    );
  }
}

export default LaunchDetailsScreen;
