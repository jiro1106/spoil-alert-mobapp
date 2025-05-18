import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen size and for responsiveness

export const styles = StyleSheet.create({
  // mainContainer and screenContainer is a STANDARD
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenContainer: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  titleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFresh: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 6,
    borderLeftColor: '#2e7d32',
  },
  cardMildSpoiled: {
    backgroundColor: '#fff3e0',
    borderLeftWidth: 6,
    borderLeftColor: '#f57c00',
  },
  cardSpoiled: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 6,
    borderLeftColor: '#c62828',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardTitleFresh: {
    color: '#2e7d32',
  },
  cardTitleMild: {
    color: '#f57c00',
  },
  cardTitleSpoiled: {
    color: '#c62828',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    right: 15,
    top: 15,
  },
  statusFresh: {
    backgroundColor: '#2e7d32',
  },
  statusMild: {
    backgroundColor: '#f57c00',
  },
  statusSpoiled: {
    backgroundColor: '#c62828',
  },
});
